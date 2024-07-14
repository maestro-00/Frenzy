import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "../ui/Spinner";
import { Link, useParams } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChars = async () => {
      const result = await axios(
        `https://www.omdbapi.com/?i=${movieId}&apikey=c486b70d`
      );
      if (result.data.Response === "True") {
        setMovie(result.data);
      } else {
        setMovie([]);
      }
      setLoading(false);
    };

    fetchChars();
  }, [movieId]);
  return loading ? (
    <Spinner />
  ) : (
    <div>
      <div><Link to="/">{"< Home"}</Link></div>
    <div className="wall">
      <div className="poster">
        <h2>{movie.Title}</h2>
        <img src={movie.Poster} alt="poster" />
      </div>      
      <div className="details">
        <ul className="info">
          <li>
            <strong>Year: </strong>
            {movie.Year}
          </li>
          <li>
            <strong>Rated: </strong>
            {movie.Rated}
          </li>
          <li>
            <strong>Released: </strong>
            {movie.Released}
          </li>
          <li>
            <strong>Genre: </strong>
            {movie.Genre}
          </li>
          <li>
            <strong>Director: </strong>
            {movie.Director}
          </li>
          <li>
            <strong>Writer: </strong>
            {movie.Writer}
          </li>
          <li>
            <strong>Actors: </strong>
            {movie.Actors}
          </li>
          <li>
            <strong>Plot: </strong>
            {movie.Plot}
          </li>
          <li>
            <strong>Language: </strong>
            {movie.Language}
          </li>
          <li>
            <strong>Country: </strong>
            {movie.Country}
          </li>
          <li>
            <strong>Awards: </strong>
            {movie.Awards}
          </li>
          <li>
            <strong>Metascore: </strong>
            {movie.Metascore}
          </li>
          <li>
            <div>
            <strong>Ratings: </strong>
              {movie.Ratings.map(rating => (
                <div key={rating.Source}>
                  <em>{rating.Source}:</em> {rating.Value}
                </div>
              ))}
            </div> 
          </li>
          <li>
            <strong>ImDb Rating: </strong>
            {movie.imdbRating}
          </li>
          <li>
            <strong>ImDb Votes: </strong>
            {movie.imdbVotes}
          </li>
          <li>
            <strong>DVD: </strong>
            {movie.DVD}
          </li>
          <li>
            <strong>BoxOffice: </strong>
            {movie.BoxOffice}
          </li>
          <li>
            <strong>Production: </strong>
            {movie.Production}
          </li>
          <li>
            <strong>Website: </strong>
            {movie.Website}
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default MovieDetail;
