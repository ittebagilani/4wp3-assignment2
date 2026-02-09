const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// middleware
app.use(express.json())
app.use("/app", express.static(path.join(__dirname, "app")));


// root redirect (going to / automatically goes to /app)
app.get('/', (req, res) => {
  res.redirect('/app');
});

// api route
app.post('/api/movies', async (req, res) => {
  const { query, sort, minRating, year } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required!!!" });
  }

  try {
    // ideally this is saved in a .env file but for an assignment its fine
    const apiKey = 'b3a40a7b7c1538e1c24361f4bc3c8fd2';

    let apiURL = `https://api.themoviedb.org/3/search/movie` +
      `?api_key=${apiKey}` +
      `&query=${encodeURIComponent(query)}`;
    if (year) {
      apiURL += `&primary_release_year=${year}`;
    }

    const response = await fetch(apiURL);
    const data = await response.json();

    // processing
    let movies = data.results || [];

    if (minRating) {
      movies = movies.filter(
        movie => movie.vote_average >= Number(minRating)
      );
    }

    // sort based on the sort parameter
    if (sort === 'popularity.desc') {
      movies.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === 'vote_average.desc') {
      movies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sort === 'release_date.desc') {
      movies.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
        return dateB - dateA;
      });
    }

    // format
    const formattedMovies = movies.slice(0, 12).map(movie => ({
      title: movie.title,
      rating: movie.vote_average,
      releaseYear: movie.release_date ? movie.release_date.split("-")[0] : 'N/A',
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null
    }));

    res.json(formattedMovies)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movie info"});
  }
});





app.get('/app', (req, res) => {
  const filePath = path.join(__dirname, 'app', 'index.html');
  res.sendFile(filePath);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});