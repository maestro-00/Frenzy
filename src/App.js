import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/ui/Header';
import axios from 'axios';
import MovieGrid from './components/movies/MovieGrid';
import Search from './components/ui/Search';

const App = () => {
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("Batman");

  useEffect(() => {
  
    const fetchChars = async () => {
      const result = await axios(`https://www.omdbapi.com/?s=${query}&apikey=c486b70d`); 
      if(result.data.Response === "True") {
        setMovies(result.data.Search);
      }else {
        setMovies([]);
      } 
      setLoading(false);
    }

    fetchChars();
  },[query]);
  return (
    <div className="container">
      <Header/>
      <Search getQuery={setQuery}/>
      <MovieGrid movies={movies} loading={loading}/>
    </div>
  );
}

export default App;
