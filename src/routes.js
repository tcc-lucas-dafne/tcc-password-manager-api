const express = require('express');

const { login, register } = require('./controller/users');
const { getCredentials, saveCredential } = require('./controller/credentials');

const routes = express.Router();

routes.post('/user/login', login);
routes.post('/user/register', register);

routes.get('/credential/:id', getCredentials);
routes.post('/credential/', saveCredential);

module.exports = routes;