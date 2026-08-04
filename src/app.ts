import express, { type Express } from 'express';
import recipesRouter from './routes/recipe.js';

const app: Express = express();

app.use(express.json()); // to read data coming in from the client, convert JSON into JS object
app.get('/', (req, res) => {
  res.json({
    message: 'Check http://localhost:3000/api/recipes',
  });
});
app.use('/api/recipes', recipesRouter);

export default app;
