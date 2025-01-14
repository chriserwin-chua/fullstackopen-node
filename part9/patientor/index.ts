import express from 'express';
import diagnoseRoute from './src/routes/diagnosis';
import patientRoute from './src/routes/patients';
import cors from 'cors';

const app = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnosis', diagnoseRoute);
app.use('/api/patients', patientRoute);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
