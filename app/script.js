const form = document.getElementById('movieForm');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    query: document.getElementById('query').value,
    sort: document.getElementById('sort').value,
    minRating: document.getElementById('rating').value,
    year: document.getElementById('year').value
  };

  console.log('Sending data:', data);

  // Backend route will be added later
  const response = await fetch('/api/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const movies = await response.json();
  displayMovies(movies);
});

function displayMovies(movies) {
  resultsDiv.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}">` : ''}
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.rating}</p>
      <p>${movie.releaseYear}</p>
    `;

    resultsDiv.appendChild(card);
  });
}