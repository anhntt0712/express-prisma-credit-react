import { Response } from "express";
import jwt from "jsonwebtoken";
 
export const verifyToken = (req: any, res: Response, next: () => void ) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err: Error|null, decoded: any) => {
        if(err) return res.status(403).send(err);
        req.email = decoded.email;
        next();
    })
}