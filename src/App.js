import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/ErrorBoundary';
import ModernHeader from './components/ui/ModernHeader';
import CacheIndicator from './components/ui/CacheIndicator';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import MovieDetailPage from './pages/MovieDetailPage';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ModernHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/:movieId" element={<MovieDetailPage />} />
            </Routes>
            <CacheIndicator />
          </div>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
