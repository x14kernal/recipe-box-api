import express, { type Express } from 'express';
import recipesRouter from './routes/recipe.js';

const app: Express = express();

app.use(express.json()); // to read data coming in from the client
app.get('/', (req, res) => {
  res.json({
    message: 'Check http://localhost:3000/recipes',
  });
});
app.use('/api/recipes', recipesRouter);

export default app;
