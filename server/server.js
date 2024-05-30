const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const app = express();
const port = 9999;
const JWT_SECRET = 'jwt_secret';
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const mockUsers = {
  'dylan': 'root',
  'admin': 'root'
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const fetchAllRepositories = async (repos_url) => {
  let page = 1;
  let allRepos = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${repos_url}?per_page=100&page=${page}`, {
      headers: {
        'accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': ''
      },
    });
    const repos = await response.json();
    if (repos.length > 0) {
      allRepos = allRepos.concat(repos);
      page++;
    } else {
      hasMore = false;
    }
  }
  return allRepos;
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (mockUsers[username] && mockUsers[username] === password) {
    const user = { name: username };
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token: accessToken });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/search/users', authenticateToken, async (req, res) => {
  const { q } = req.query;
  try {
    /* return a list of all the user object in the following format:
     * username
     * Total count of repositories
     * Total fork count for all repositories
     * A list of used languages with their counts, sorted by the most used to
     * least used
     */
    const response = await fetch(`https://api.github.com/search/users?q=${q}&per_page=100`, {
      headers: {
        'accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'},
        'Authorization': ''
    });
    const data = await response.json();
    const userRetrieve = data.items.map(async (user) => {
      const repoData = await fetchAllRepositories(user.repos_url);
      const totalrepos = repoData.length;
      const languages = {};
      let totalForks = 0;
      let totalStargazers = 0;
      let totalSize = 0;
      repoData.forEach((repo) => {
        totalForks += repo.forks_count;
        totalStargazers += repo.stargazers_count;
        totalSize += repo.size;
        if (repo.language) {
          if(languages[repo.language]) {
            languages[repo.language] += 1;
          } else {
            languages[repo.language] = 1;
          } 
        }
      });

      const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
      return {
        username: user.login,
        repoCount: totalrepos,
        totalForks: totalForks,
        languages: Object.fromEntries(sortedLanguages),
        totalStargazers: totalStargazers,
        averageSize: (totalSize / totalrepos).toFixed(2),
      };
    });

    const userInfo = await Promise.all(userRetrieve);
    res.json(userInfo);;



  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from GitHub' });
  }
});

app.get('*', (req, res) => {
  res.status(404).send('No such file or directory');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
