import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Info, Star } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

const MovieCard = ({ movie, searchState }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
      <Link 
        to={`/${movie.imdbID}`} 
        state={searchState}
        className="block"
      >
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.Title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white bg-primary-500 px-2 py-1 rounded">
                  {movie.Type?.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-white bg-gray-900/70 px-2 py-1 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {movie.Year}
                </span>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 z-10"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[3.5rem]">
            {movie.Title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {movie.Year}
            </span>
            <div className="flex items-center gap-1 text-primary-500 text-sm font-medium">
              <Info className="w-4 h-4" />
              <span>Details</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
