import axios from 'axios';

const API_KEY = 'c486b70d';
const BASE_URL = 'https://www.omdbapi.com/';

// Cache configuration
const CACHE_DURATION = {
  SEARCH: 5 * 60 * 1000,      // 5 minutes for search results
  DETAILS: 30 * 60 * 1000,    // 30 minutes for movie details
  AUTOCOMPLETE: 2 * 60 * 1000 // 2 minutes for autocomplete
};

// In-memory cache
const cache = new Map();

// Cache helper functions
const getCacheKey = (endpoint, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${endpoint}?${sortedParams}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.duration) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

const setCachedData = (key, data, duration) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    duration
  });
};

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.duration) {
      cache.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

// Rate limiting helper
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 200; // 200ms between calls to avoid rate limiting

const rateLimitedCall = async (apiCall) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall));
  }
  
  lastCallTime = Date.now();
  return apiCall();
};

/**
 * Search for movies with pagination
 * @param {string} title - Movie title to search
 * @param {number} page - Page number
 * @param {string} year - Year filter (optional)
 * @param {string} type - Type filter (movie, series, episode)
 * @returns {Promise} - API response
 */
export const searchMovies = async (title, page = 1, year = '', type = '') => {
  const params = {
    s: title,
    page,
    ...(year && { y: year }),
    ...(type && { type })
  };
  
  const cacheKey = getCacheKey('search', params);
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    console.log('Cache hit for search:', title, page);
    return cachedResult;
  }
  
  try {
    const data = await rateLimitedCall(async () => {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          ...params
        },
      });
      return response.data;
    });
    
    // Only cache successful responses
    if (data.Response === 'True') {
      setCachedData(cacheKey, data, CACHE_DURATION.SEARCH);
    }
    
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Get detailed movie information by ID
 * @param {string} imdbID - IMDb ID of the movie
 * @returns {Promise} - API response
 */
export const getMovieDetails = async (imdbID) => {
  const cacheKey = getCacheKey('details', { i: imdbID });
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    console.log('Cache hit for movie details:', imdbID);
    return cachedResult;
  }
  
  try {
    const data = await rateLimitedCall(async () => {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          i: imdbID,
          plot: 'full',
        },
      });
      return response.data;
    });
    
    // Only cache successful responses
    if (data.Response === 'True') {
      setCachedData(cacheKey, data, CACHE_DURATION.DETAILS);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Get autocomplete suggestions for movie search
 * @param {string} query - Search query
 * @returns {Promise} - API response
 */
export const getAutocompleteSuggestions = async (query) => {
  if (!query || query.length < 2) {
    return { Response: 'False', Search: [] };
  }
  
  const cacheKey = getCacheKey('autocomplete', { s: query });
  const cachedResult = getCachedData(cacheKey);
  
  if (cachedResult) {
    console.log('Cache hit for autocomplete:', query);
    return cachedResult;
  }
  
  try {
    const data = await rateLimitedCall(async () => {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          s: query,
          page: 1,
        },
      });
      return response.data;
    });
    
    // Cache both successful and unsuccessful responses for autocomplete
    // to avoid repeated failed searches
    setCachedData(cacheKey, data, CACHE_DURATION.AUTOCOMPLETE);
    
    return data;
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return { Response: 'False', Search: [] };
  }
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
};
