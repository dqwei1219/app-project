import React from 'react';




const UserCard = ({ user }) => {
  return (
    <div style={{
      border: '3px solid',
      borderRadius: '8px',
      padding: '5px',
      margin: '5px',
      width: '300px',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2>{user.username}</h2>
        <p>Total Repositories: {user.repoCount}</p>
        <p>Total Forks: {user.totalForks}</p>
        <p>Total Stargazers: {user.totalStargazers}</p>
        <p>Average Repo Size: {user.averageSize} KB</p>
      </div>
      <div style={{ overflow: 'auto' }}>
        <h3>Languages</h3>
        {Object.entries(user.languages).length > 0 ? 
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {Object.entries(user.languages).map(([language, count]) => (
            <li key={language}>{language}: {count}</li>
          ))} 
        </ul>
          :
          <>
            <p>No Language List Found</p>
          </>
        }

      </div>
    </div>
  );
};

export default UserCard;
