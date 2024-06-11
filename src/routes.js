import express from 'express';
import { config } from 'dotenv'
config();

import { login, register, getUser } from './controller/users.js';
import { getCredentials, saveCredential, deleteCredential } from './controller/credentials.js';

const routes = express.Router();

routes.post('/user/login', login);
routes.post('/user/register', register);
routes.get('/user/', getUser);

routes.get('/credential/:id', getCredentials);
routes.post('/credential/', saveCredential);
routes.delete('/credential/:id', deleteCredential);

export default routes;