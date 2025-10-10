/**
 * Local storage utility functions for managing favorites and preferences
 */

const FAVORITES_KEY = 'frenzy_favorites';
const THEME_KEY = 'frenzy_theme';

export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const addFavorite = (movie) => {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
    const updatedFavorites = [...favorites, movie];
    saveFavorites(updatedFavorites);
    return updatedFavorites;
  }
  return favorites;
};

export const removeFavorite = (imdbID) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.imdbID !== imdbID);
  saveFavorites(updatedFavorites);
  return updatedFavorites;
};

export const isFavorite = (imdbID) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.imdbID === imdbID);
};

export const getTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return 'dark';
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};
