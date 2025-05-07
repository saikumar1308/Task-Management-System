import { Router } from "express"
import { Request, Response } from 'express';
import { prisma } from "../prisma";
import { authMiddleware } from "../middleware/auth";

export const taskRouter = Router()

interface TaskBody {
    id: string;
    title: string;
    description: string;
    dueDate: string | Date;
    priority: string;
    status: string;
    assignedToId?: string;
  }

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
                assignedToId: body.assignedToId || null,
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
                assignedToId: body.assignedToId || null,
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
                OR:[
                    { createdById: userId },
                    { assignedToId: userId }
                ]
            },
        })
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while updating task' });
    }
})