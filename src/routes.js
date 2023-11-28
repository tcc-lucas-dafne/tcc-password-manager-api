const express = require('express');

const { login, register } = require('./controller/users');

const routes = express.Router();

routes.post('/user/login', login);
routes.post('/user/register', register);

module.exports = routes;