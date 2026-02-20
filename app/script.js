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

  const response = await fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

    
    const posterHTML = movie.poster
      ? `<div class="movie-poster">
           <img src="${movie.poster}" alt="${escapeHtml(movie.title)}" loading="lazy">
         </div>`
      : `<div class="movie-poster">
           <div class="poster-fallback">
             <i data-lucide="film" class="fallback-icon"></i>
             <span>${escapeHtml(movie.title)}</span>
           </div>
         </div>`;

    const ratingNum = typeof movie.rating === 'number'
      ? movie.rating.toFixed(1)
      : movie.rating;

    card.innerHTML = `
      ${posterHTML}
      <div class="movie-info">
        <div class="movie-title">${escapeHtml(movie.title)}</div>
        <div class="movie-meta">
          <div class="movie-rating">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78z"/>
            </svg>
            ${ratingNum}
          </div>
          <div class="movie-year">${movie.releaseYear}</div>
        </div>
      </div>
    `;

    resultsDiv.appendChild(card);
  });

  
  lucide.createIcons();
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}