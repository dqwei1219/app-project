import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery); 
      setError('');
    } else {
      setError('Please enter a search query.');
    }
  };

  return (
    <div>  
      <p style={{'fontSize': 10, 'color': 'red', alignItems:'center'}}>{error}</p>
      <form onSubmit={handleSubmit}>
        <input
          size="45"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search Name'
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;
