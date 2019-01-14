const express = require('express');
const Router = express.Router();
const UserController = require('../controller/user.controller');
const InterceptorController = require('../controller/interceptor.controller');

Router.all('*', InterceptorController.tokenValidate);
Router.post('/register', UserController.register); 

module.exports = Router;