import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipe.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';
import { requireAuth } from './middlewares/requireAuth.js';

const app: Express = express();

app.use(cors());
app.use(express.json()); // to read data coming in from the client, convert JSON into JS object
app.use(logger);

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return sendSuccess(res, {
    message: 'Recipe Box API',
    recipes: `${baseUrl}/api/recipes`,
  });
});

app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);

app.use(errorHandler);

export default app;
