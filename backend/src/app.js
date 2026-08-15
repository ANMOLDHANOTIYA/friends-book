import express from 'express';
import userRouter from './routes/user.routes.js';
import followRouter from "./routes/follow.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import notificationRouter from "./routes/notification.route.js";
import postRouter from "./routes/post.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/users', userRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

app.get('/', (req, res) => {
  res.send('friends-book api is running');
});

app.use(errorHandler);

export default app;