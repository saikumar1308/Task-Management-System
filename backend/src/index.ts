import express from 'express';
import { userRouter } from './routes/user';
import { taskRouter } from './routes/task';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/user', userRouter)

app.use('/api/task', taskRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});
