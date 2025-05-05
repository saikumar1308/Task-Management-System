import { Router } from "express"
import { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from "../prisma";

interface TaskBody {
    id: string;
    title: string;
    description: string;
    dueDate: string | Date;
    priority: string;
    status: string;
    assignedToId?: string;
}

export const taskRouter = Router()

interface JwtPayload {
    id: string;
}

const authMiddleware: RequestHandler = async (req, res, next) => {
    const token = req.header("Authorization") || "";

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (user) {
            // @ts-ignore
            req.userId = user.id;
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: "Invalid token"
        });
    }
};

taskRouter.use(authMiddleware);

taskRouter.post('/', async (req: Request, res: Response) => {
    const body = req.body as TaskBody;
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        const task = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                dueDate: body.dueDate,
                priority: body.priority,
                status: body.status,
                createdById: userId,
            }
        })
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while creating task' });
    }
})

taskRouter.put('/', async (req: Request, res: Response) => {
    const body = req.body as TaskBody & { id: string };
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        const task = await prisma.task.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                description: body.description,
                dueDate: body.dueDate,
                priority: body.priority,
                status: body.status,
            }
        })
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while updating task' });
    }
})

taskRouter.delete('/', async (req: Request, res: Response) => {
    const body = req.body as TaskBody & { id: string };
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        const task = await prisma.task.delete({
            where: {
                id: body.id
            },
        })
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while updating task' });
    }
})

taskRouter.get('/', async (req: Request, res: Response) => {
    // const body = req.body as TaskBody & { id: string };
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        const task = await prisma.task.findMany({
            where: {
                createdById: userId
            },
        })
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while updating task' });
    }
})