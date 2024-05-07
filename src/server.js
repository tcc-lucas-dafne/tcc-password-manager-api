const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/v1', routes);

app.get('/', (_, res) => {
  res.status(200);
  res.send({ "status": "success" });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;