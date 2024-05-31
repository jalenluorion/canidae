import path from 'path';
import express from 'express';
import app from './app';

const port = '3001';

app.set('port', port);

app.use(express.static(path.join(__dirname, "front", "build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "front", "build", "index.html"));
});

app.on('error', () => console.error('error'));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
