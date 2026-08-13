import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('friends-book api is running');
});

export default app;