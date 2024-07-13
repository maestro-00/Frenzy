import React from "react";
import MovieItem from "./MovieItem";
import Spinner from "../ui/Spinner";

const MovieGrid = ({ movies, loading }) => {
  console.table(movies);
  return loading ? (
    <Spinner/>
  ) : movies.length > 0 ? (
    <section className="cards">
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie}/>
      ))}
    </section>
  ) : <div style={{textAlign: "center", marginTop: "4rem"}}>Movie Not Found</div>;
};

export default MovieGrid;
