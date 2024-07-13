import React, { useState } from "react";

const Search = ({ getQuery }) => {
  const [title, setTitle] = useState("");

  const onChange = (q) => {
      setTitle(q);
    if (q.length > 2) 
      getQuery(q);
    
  };
  return (
    <section>
      <form>
        <input
          value={title}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          autoFocus
          className="form-control"
          placeholder="Search for a movie"
        />
      </form>
    </section>
  );
};

export default Search;
