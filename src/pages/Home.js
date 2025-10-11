import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import MovieCard from '../components/movies/MovieCard';
import { searchMovies } from '../services/movieService';

const Home = () => {
  const location = useLocation();
  const savedState = location.state;
  
  const [movies, setMovies] = useState(savedState?.movies || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(savedState?.query || '');
  const [actualQuery, setActualQuery] = useState(savedState?.actualQuery || 'Batman');
  const [page, setPage] = useState(savedState?.page || 1);
  const [hasMore, setHasMore] = useState(savedState?.hasMore ?? true);
  const [totalResults, setTotalResults] = useState(savedState?.totalResults || 0);
  const [filters, setFilters] = useState(savedState?.filters || { type: '', year: '' });
  
  const observer = useRef();
  const lastMovieRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchMovies = useCallback(async (searchQuery, pageNum, isNewSearch = false) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(searchQuery, pageNum, filters.year, filters.type);
      
      if (data.Response === 'True') {
        const newMovies = data.Search || [];
        
        setMovies(prev => {
          if (isNewSearch) {
            return newMovies;
          }
          // Remove duplicates by filtering out movies that already exist
          const existingIds = new Set(prev.map(m => m.imdbID));
          const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.imdbID));
          return [...prev, ...uniqueNewMovies];
        });
        setTotalResults(parseInt(data.totalResults, 10));
        setHasMore(pageNum * 10 < parseInt(data.totalResults, 10));
      } else {
        if (isNewSearch) {
          setMovies([]);
          setError(data.Error || 'No movies found');
        }
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.year, filters.type]);

  // Restore scroll position when coming back from detail page
  useEffect(() => {
    if (savedState?.scrollPosition) {
      window.scrollTo(0, savedState.scrollPosition);
      // Clear the state after restoring to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [savedState]);

  useEffect(() => {
    // Skip fetching if we have saved state (coming back from detail page)
    if (savedState?.movies && savedState.movies.length > 0) {
      return;
    }
    
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(actualQuery, 1, true);
  }, [actualQuery, filters.type, filters.year, fetchMovies, savedState]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(actualQuery || 'Batman', page, false);
    }
  }, [page, actualQuery, fetchMovies]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setActualQuery(searchQuery || '');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>

        {/* Filters */}
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

        {/* Results Count */}
        {totalResults > 0 && (
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-gray-100">{totalResults}</span> results
          </div>
        )}

        {/* Movies Grid */}
        {movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {movies.map((movie, index) => {
              // Create unique key using imdbID and index to handle API duplicates
              const uniqueKey = `${movie.imdbID}-${index}`;
              
              const searchState = {
                movies,
                query,
                actualQuery,
                page,
                hasMore,
                totalResults,
                filters,
                scrollPosition: window.scrollY
              };
              
              if (movies.length === index + 1) {
                return (
                  <div ref={lastMovieRef} key={uniqueKey}>
                    <MovieCard movie={movie} searchState={searchState} />
                  </div>
                );
              } else {
                return <MovieCard key={uniqueKey} movie={movie} searchState={searchState} />;
              }
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading movies...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">Oops! Something went wrong</p>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        )}

        {/* No More Results */}
        {!hasMore && movies.length > 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            You've reached the end of the results
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
