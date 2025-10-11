import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../../utils/debounce';
import { getAutocompleteSuggestions } from '../../services/movieService';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete fetch
  const fetchSuggestions = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getAutocompleteSuggestions(searchQuery);
      if (data.Response === 'True' && data.Search) {
        setSuggestions(data.Search.slice(0, 5)); // Limit to 5 suggestions
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    if (value.trim()) {
      fetchSuggestions(value);
      onSearch(value);
    } else {
      setSuggestions([]);
      onSearch('');
    }
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.Title);
    setShowSuggestions(false);
    setSuggestions([]);
    navigate(`/${movie.imdbID}`);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Search for movies, series, episodes..."
            className="w-full pl-12 pr-12 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading suggestions...
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((movie) => (
                <li
                  key={movie.imdbID}
                  onClick={() => handleSuggestionClick(movie)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                >
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/50x75?text=No+Image'}
                    alt={movie.Title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {movie.Title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {movie.Year} • {movie.Type}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
