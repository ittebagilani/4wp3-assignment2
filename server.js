const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.redirect('/app');
});

app.get('/app', (req, res) => {
  const filePath = path.join(__dirname, 'app', 'index.html');
  res.sendFile(filePath);
});

app.use('/app', express.static(path.join(__dirname, 'app')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});