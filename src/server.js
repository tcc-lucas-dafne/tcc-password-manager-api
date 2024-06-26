import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { config } from 'dotenv'
config();

import routes from './routes.js'; 

const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // X - 15m - 60s - 1000ms
  max: 10, // Usuario pode realizar 10 requisicoes em X minutos
  message: {
    status: "error",
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use('/api/v1', routes);

app.get('/', (_, res) => {
  res.status(200);
  res.send({ "status": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
