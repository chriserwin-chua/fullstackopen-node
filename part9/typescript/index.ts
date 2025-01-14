import express from 'express';
import { bmiCalculator } from './bmiCalculator';
import { calculateResult } from './exerciseCalculator';
const app = express();
app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight) {
    res.json({ error: 'malformatted parameters' });
  }
  const result = bmiCalculator(Number(height), Number(weight));

  res.json({ height, weight, bmi: result });
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    res.json({ error: 'missing parameters' });
  }
  if (isNaN(Number(target))) res.json({ error: 'malformatted parameters' });
  const result = calculateResult(Number(target), daily_exercises);

  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
