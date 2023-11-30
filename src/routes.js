const express = require('express');

const { login, register, getUser } = require('./controller/users');
const { getCredentials, saveCredential, deleteCredential } = require('./controller/credentials');

const routes = express.Router();

routes.post('/user/login', login);
routes.post('/user/register', register);
routes.get('/user/', getUser);

routes.get('/credential/:id', getCredentials);
routes.post('/credential/', saveCredential);
routes.delete('/credential/:id', deleteCredential);

module.exports = routes;