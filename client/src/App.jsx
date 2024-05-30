import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchRepoPage from './component/searchRepoPage';
import Login from './component/LoginPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoginStatus = () => {
    setIsLoggedIn((prev) => !prev);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <SearchRepoPage /> : <Login updateLoginStatus={updateLoginStatus} />} />
        <Route path="/search" element={isLoggedIn ? <SearchRepoPage/> : <Login updateLoginStatus={updateLoginStatus} />} />
        <Route path='/login' element={<Login updateLoginStatus={updateLoginStatus} />} />
      </Routes>
    </Router>
  );
}

export default App;