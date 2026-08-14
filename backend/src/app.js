import express from 'express';
import userRouter from './routes/user.routes.js';
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.send('friends-book api is running');
});

app.use(errorHandler);

export default app;