import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, Star, Globe, Award, 
  Users, Film, Heart, Loader2, TrendingUp 
} from 'lucide-react';
import { getMovieDetails } from '../services/movieService';
import { useFavorites } from '../context/FavoritesContext';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchState = location.state;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getMovieDetails(movieId);
        
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Movie not found');
        }
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleFavoriteClick = () => {
    if (movie) {
      toggleFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  const handleBackClick = () => {
    if (searchState) {
      navigate('/', { state: searchState });
    } else {
      navigate('/');
    }
  };

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{error}</p>
        <button 
          onClick={handleBackClick}
          className="text-primary-500 hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  const favorite = isFavorite(movie.imdbID);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to search</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : ''}
            alt=""
            className="w-full h-full object-cover blur-2xl"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movie.Title}
                className="w-full md:w-80 rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.Title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.Year && (
                  <span className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    {movie.Year}
                  </span>
                )}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    {movie.Runtime}
                  </span>
                )}
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm font-semibold">
                    {movie.Rated}
                  </span>
                )}
              </div>

              {/* Ratings */}
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg">{movie.imdbRating}</span>
                    <span className="text-sm">/10</span>
                  </div>
                )}
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-lg">{movie.Metascore}</span>
                    <span className="text-sm">Metascore</span>
                  </div>
                )}
              </div>

              {/* Genre */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.Genre.split(', ').map(genre => (
                    <span key={genre} className="px-3 py-1 bg-primary-500 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  {movie.Plot}
                </p>
              )}

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  favorite
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cast & Crew */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-500" />
              Cast & Crew
            </h2>
            
            <div className="space-y-4">
              {movie.Director && movie.Director !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Director</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Director}</p>
                </div>
              )}
              
              {movie.Writer && movie.Writer !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Writer</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Writer}</p>
                </div>
              )}
              
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Actors</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Actors}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Film className="w-6 h-6 text-primary-500" />
              Additional Information
            </h2>
            
            <div className="space-y-4">
              {movie.Released && movie.Released !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Released</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Released}</p>
                </div>
              )}
              
              {movie.Language && movie.Language !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Language}</p>
                </div>
              )}
              
              {movie.Country && movie.Country !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Country</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Country}</p>
                </div>
              )}
              
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Awards
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Awards}</p>
                </div>
              )}
              
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Box Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.BoxOffice}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ratings from different sources */}
        {movie.Ratings && movie.Ratings.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ratings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {movie.Ratings.map((rating) => (
                <div key={rating.Source} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{rating.Source}</span>
                  <span className="text-primary-500 font-bold">{rating.Value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
