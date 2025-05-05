import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';

export const userRouter = Router();

userRouter.post('/signup', async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while signing up' });
  }
});

userRouter.post('/login', async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const valid = await bcrypt.compare(body.password, user.password);

    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while logging in' });
  }
});

userRouter.get('/', authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      error: "Unauthorized"
    });
    return;
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Fetch Users error", error);
    res.status(500).json({ error: 'Error while fetching users' });
  }
});
