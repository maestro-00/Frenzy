import React from "react";
import { Link } from "react-router-dom";

const MovieItem = ({ movie }) => {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-front">
          <img src={movie.Poster} alt="" />
        </div>
        <div className="card-back">
          <h1>
            {movie.Title.length > 30
              ? movie.Title.substring(0, 29) + "..."
              : movie.Title}
          </h1>
          <ul>
            <li>
              <strong>Year: </strong>
              {movie.Year}
            </li>
            <li>
              <strong>Type: </strong>
              {movie.Type}
            </li>
            <li className="info">
              {/* <a href='#'>More Info</a> */}
              <Link to={`/` + movie.imdbID}>More Info</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
