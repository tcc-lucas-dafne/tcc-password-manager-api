import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './logger.js';
import morgan from 'morgan';

import { config } from 'dotenv'
config();

import routes from './routes.js'; 

const PORT = process.env.PORT || 3001;

const app = express();

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).send('Something went wrong!');
});

app.use('/api/v1', routes);

app.get('/', (_, res) => {
  res.status(200);
  res.send({ "status": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
