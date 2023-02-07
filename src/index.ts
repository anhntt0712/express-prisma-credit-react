import cors from 'cors';
import express from "express";
import cache from 'express-redis-cache';
import userRouter from "./routers/user.router";
import cookieParser from 'cookie-parser';
import todoRouter from './routers/todo.router';
const app = express();
const port = process.env.PORT || 8000;
var client1 = cache({ host: "127.0.0.1",port: "6379" });

app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use('/', userRouter);
app.use('/todos', todoRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});