import { Request, Response } from "express";
import { prismaTodo } from "../clients/prisma.client";
import { decodeToken } from "../utils/user.util";
export const getTodos = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const todos = await prismaTodo.findMany({
                where: {
                    user_id: decodeToken(token)?.userId,
                },
            });
            res.json(todos);
        } else {
            res.send(401);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

export const createTodo = async (req: Request, res: Response) => {
    try {
        const todo = await prismaTodo.create({
            data: {
                ...req.body,
                user_id: decodeToken(req.headers.authorization as string).userId
            }
        });

        res.json(todo);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
};


export const getTodoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const todo = await prismaTodo.findUnique({
        where: {
            id,
        },
    });

    if (!todo) {
        return res.status(401).send(`Todo with id: ${id} not found`);
    }
    res.json(todo);
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const user = await prismaTodo.update({
            data: req.body,
            where: {
                id,
            },
        });

        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await prismaTodo.delete({
            where: {
                id,
            },
        });

        res.json({ message: "Todo has been deleted" });
    } catch (error) {
        res.status(400).json(error);
    }
};
