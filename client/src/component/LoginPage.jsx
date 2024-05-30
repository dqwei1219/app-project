import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ updateLoginStatus }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:9999/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        updateLoginStatus();
        console.log('Login successful')
        console.log(localStorage.getItem('token'))
        navigate('/search');
      } else {
        setError("Password or Username Incorrect");
      }
    } catch (error) {
      console.error('Failed to login', error);
      setError('Failed to login');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Login Page</h1>
      <div className='login-container'>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};

export default Login;
