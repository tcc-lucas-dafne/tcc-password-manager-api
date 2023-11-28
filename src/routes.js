const express = require('express');

const { login } = require('./controller/users');

const routes = express.Router();

routes.post('/user/login', login);

module.exports = routes;