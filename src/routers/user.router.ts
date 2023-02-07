import express from "express";
import { verifyToken } from "../middlewares/verify-token.middleware";
import { refreshToken } from "../controllers/refresh-token.controller";
import { login, logout, register } from "../controllers/user.controller";
 
const router = express.Router();
 
router.post('/users', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
 
export default router;