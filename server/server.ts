import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.middleware.js';
import authRouter from './routes/authRoutes.js';
import socialAuthRouter from './routes/socialAuthRoutes.js';
import accountRouter from './routes/accountRoutes.js';
import postRouter from './routes/postRoutes.js';
import activityRouter from './routes/activityRoutes.js';
import { initScheduler } from './utils/schedulerService.js';

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
    res.send("Server is Live");
});

app.use('/api/auth', authRouter);
app.use('/api/oauth', socialAuthRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/posts', postRouter);
app.use('/api/activity', activityRouter);

//Global Error Handler
app.use(errorHandler);

const startServer = async () => {
    try {
        //Database Connection
        await connectDB();

        // Initialize scheduler after DB connection is established
        initScheduler();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error: any) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();