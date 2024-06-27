import express from 'express';
import { config } from 'dotenv'
config();

import { login, register, getUser } from './controller/users.js';
import { getCredentials, saveCredential, deleteCredential } from './controller/credentials.js';
import { checkBearerToken } from './middleware/check-token.js';

const routes = express.Router();

routes.post('/user/login', login);
routes.post('/user/register', register);
routes.get('/user/', checkBearerToken, getUser);

routes.get('/credential/', checkBearerToken, getCredentials);
routes.post('/credential/', checkBearerToken, saveCredential);
routes.delete('/credential/:id', checkBearerToken, deleteCredential);

export default routes;