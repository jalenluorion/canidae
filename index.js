const http = require('http');
const app = require('./app');
const path = require('path');
const express = require('express');

const port = process.env.PORT || '3001';

app.set('port', port);

app.use(express.static(path.join(__dirname, "front", "build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "front", "build", "index.html"));
});

const server = http.createServer(app);

server.on('error', () => console.error('error'));
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
