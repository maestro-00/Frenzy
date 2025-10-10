import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useFavorites } from '../../context/FavoritesContext';

const ModernHeader = () => {
  const location = useLocation();
  const { favorites } = useFavorites();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Frenzy
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Movie Database</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                isActive('/favorites')
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
