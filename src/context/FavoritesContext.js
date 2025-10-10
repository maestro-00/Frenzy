import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite as addFav, removeFavorite as removeFav, isFavorite as checkFavorite } from '../utils/localStorage';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const addFavorite = (movie) => {
    const updatedFavorites = addFav(movie);
    setFavorites(updatedFavorites);
  };

  const removeFavorite = (imdbID) => {
    const updatedFavorites = removeFav(imdbID);
    setFavorites(updatedFavorites);
  };

  const isFavorite = (imdbID) => {
    return checkFavorite(imdbID);
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
