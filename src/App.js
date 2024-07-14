import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/ui/Header';
import axios from 'axios';
import MovieGrid from './components/movies/MovieGrid';
import Search from './components/ui/Search'; 
import { Route, Router, Routes } from 'react-router-dom';
import MovieDetail from './components/movies/MovieDetail'; 
import PaginationControls from './components/Pagination/PaginationControls'; 

const App = () => {
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("Batman");

  // State to store the current page number
  const [page , setPage] = useState(1);

  // State to store the total number of pages
  const [totalPages , setTotalPages] = useState(1);

  useEffect(() => {
  
    const fetchChars = async () => {

      const result = await axios(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=c486b70d`); 
      
      if(result.data.Response === "True") {
        setMovies(result.data.Search);

        // total number of pages based on the total results
        const totalResults = parseInt(result.data.totalResults, 10);
        const moviePages = 10; // total number of pages
        setTotalPages(Math.ceil(totalResults / moviePages));
      }else {
        setMovies([]);
        
        // If no results are found totalPages to 1
        setTotalPages(1);
      } 
      setLoading(false);
    }

    fetchChars();
  },[query,page]);
  
  // Function to handle page changes
  const handlePageChange = (newPage) =>{

    // new page is within the valid range
    if(newPage >0 && newPage <=totalPages){
      setPage(newPage);
    }
  }
  
  return ( 
    <div className="container"> 
        <Header/>
      <Routes>
      <Route
          path="/"
          element={
            <>
              <Search getQuery={setQuery}/>
              <MovieGrid movies={movies} loading={loading}/>
               {/* Show Pagination only if there are results and more than 1 page  */}
              {movies.length > 0 && totalPages > 1 && (
                <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </>
          }
        /> 
      <Route
          path="/:movieId"
          element={
            <MovieDetail/>
          }
        /> 
      </Routes>  
    </div>
  );
}

export default App;
