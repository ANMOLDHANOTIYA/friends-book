import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 