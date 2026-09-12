import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipe.js';
import authRouter from './routes/auth.js';
import bookmarkRouter from './routes/bookmark.js';
import sessionRouter from './routes/session.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin (Postman, server-to-server, etc.)
      if (!origin) return callback(null, true);

      // Allow any localhost / 127.0.0.1 port
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
        return callback(null, true);

      // Allow production frontend
      if (origin === 'https://recipes-x.vercel.app') return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.set('trust proxy', 1); // Trust the first proxy (Vercel's edge network)
app.use(cookieParser());
app.use(express.json()); // to read data coming in from the client, convert JSON into JS object
app.use(logger);

app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/bookmarks', bookmarkRouter);

app.use(errorHandler);

export default app;
