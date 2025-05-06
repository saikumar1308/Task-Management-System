import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { authMiddleware } from "../middleware/auth";

export const notifRouter = Router();

notifRouter.use(authMiddleware);

notifRouter.post('/', async (req: Request, res: Response) => {
    const { message } = req.body;
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }

    try {
        const notif = await prisma.notification.create({
            data: {
                userId,
                message,
            },
        });

        res.status(201).json(notif);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while creating notification' });
    }
});

notifRouter.get('/', async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            error: "Unauthorized"
        });
        return;
    }
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while fetching notifications' });
    }
});
  