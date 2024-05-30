import React, { useState } from 'react';
import SearchForm from './SearchForm';
import UserCard from './UserCard';


const mockUsers = [
  {
    username: 'user1',
    repoCount: 10,
    totalForks: 100,
    totalStargazers: 1000,
    averageSize: 100,
    languages: {
      JavaScript: 5,
      Python: 3,
      Java: 2,
    },
  },  
  {
    username: 'user2',
    repoCount: 20,
    totalForks: 200,
    totalStargazers: 2000,
    averageSize: 200,
    languages: {
      JavaScript: 10,
      Python: 5,
      Java: 5,
    },
  },

  {
    username: 'user3',
    repoCount: 30,
    totalForks: 300,
    totalStargazers: 3000,
    averageSize: 300,
    languages: {
      JavaScript: 15,
      Python: 7,
      Java: 8,
      C2 : 3,
      Lua: 3,
      P: 1,
      C: 1
    },
  },
    {
      username: 'user3.1',
      repoCount: 20,
      totalForks: 200,
      totalStargazers: 2000,
      averageSize: 200,
      languages: {
        JavaScript: 10,
        Python: 5,
        Java: 5,
      },
    },
    {
      username: 'user4',
      repoCount: 20,
      totalForks: 200,
      totalStargazers: 2000,
      averageSize: 200,
      languages: {
        JavaScript: 10,
        Python: 5,
        Java: 5,
      },
    },
    {
      username: 'user5',
      repoCount: 20,
      totalForks: 200,
      totalStargazers: 2000,
      averageSize: 200,
      languages: {
        JavaScript: 10,
        Python: 5,
        Java: 5,
      },
    },

    {
      username: 'user6',
      repoCount: 20,
      totalForks: 200,
      totalStargazers: 2000,
      averageSize: 200,
      languages: {
        JavaScript: 10,
        Python: 5,
        Java: 5,
      },
    },
];

const ITEMS_PER_PAGE = 6; 

const SearchRepoPage = () => {
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (query) => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      setLoading(true); 
      const response = await fetch(`http://localhost:9999/api/search/users?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users query');
      }
      const data = await response.json();
      console.log("here is all the data", data)
      setUsers(data);
      setSearched(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>GitHub User Search </h1>
        <SearchForm onSearch={handleSearch} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading && <p>Loading...</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {searched && users.length === 0 && (
          <p>No users found.</p>
        )}
        {searched && currentUsers.length > 0 && (
          currentUsers.map((user) => (
            <UserCard key={user.username} user={user} />
          ))
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        {currentPage > 1 && (
          <button onClick={handlePreviousPage}>Previous</button>
        )}
        {indexOfLastUser < users.length && (
          <button onClick={handleNextPage}>Next</button>
        )}
      </div>
    </div>
  );
};

export default SearchRepoPage;
