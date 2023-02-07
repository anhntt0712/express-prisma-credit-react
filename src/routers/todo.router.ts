import express from "express";
import { verifyToken } from "../middlewares/verify-token.middleware";
import { refreshToken } from "../controllers/refresh-token.controller";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "../controllers/todo.controller";
 
const router = express.Router();
 
router.get('/', verifyToken, getTodos);
router.get('/:id', verifyToken, getTodoById);
router.delete('/:id', verifyToken, deleteTodo);
router.put('/:id', verifyToken, updateTodo)
router.post('/', verifyToken, createTodo)

export default router;