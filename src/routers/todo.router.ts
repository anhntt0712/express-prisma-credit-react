import express, { Request, Response } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware";
import { refreshToken } from "../controllers/refresh-token.controller";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { redisCache } from "../redis";

const router = express.Router();

router.get("/", verifyToken, getTodos);
router.get(
  "/:id",
  verifyToken,
  (req: Request, res: Response, next) => {
    res.express_redis_cache_name = "todos-" + req.params.id;
    next();
  },
  redisCache.route(),
  getTodoById
);
router.delete("/:id", verifyToken, deleteTodo);
router.put("/:id", verifyToken, updateTodo);
router.post("/", verifyToken, createTodo);

export default router;
