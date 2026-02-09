const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  console.log('✓ Redirecting from / to /app');
  res.redirect('/app');
});

app.get('/app', (req, res) => {
  const filePath = path.join(__dirname, 'app', 'index.html');
  console.log('Attempting to serve:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  res.sendFile(filePath);
});

app.use('/app', express.static(path.join(__dirname, 'app')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});