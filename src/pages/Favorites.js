import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/movies/MovieCard';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length === 0
              ? 'No favorites yet. Start adding movies you love!'
              : `You have ${favorites.length} favorite ${favorites.length === 1 ? 'movie' : 'movies'}`}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 text-center">
              Your favorites list is empty
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-center mt-2">
              Browse movies and click the heart icon to add them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
