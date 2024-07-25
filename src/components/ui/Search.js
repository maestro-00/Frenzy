import React, { useState } from "react";
import "./Search.css"

const Search = ({ getQuery }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("movie");

  const onChangeTitle = (q) => {
    setTitle(q);
    getQuery(q, year, type);
  };

  const onChangeYear = (y) => {
    setYear(y);
    getQuery(title, y, type);
  };

  const onChangeType = (t) => {
    setType(t);
    getQuery(title, year, t);
  };

  return (
    <section>
      <form className="search">
        <input
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          type="text"
          autoFocus
          className="form-control"
          placeholder="Search for a movie"
        />
            <input
          value={year}
          onChange={(e) => onChangeYear(e.target.value)}
          type="number"
          className="form-control"
          placeholder="Year"
        />
        <select
          value={type}
          onChange={(e) => onChangeType(e.target.value)}
          className="form-control"
        >
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
          <option value="game">Game</option>
        </select>
           </form>
    </section>
  );
};

export default Search;
