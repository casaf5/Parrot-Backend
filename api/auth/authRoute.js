const Router = require('express').Router();
const { login, signup, authUser } = require('./authController');

Router.post('/login', login);
Router.post('/signup', signup);
Router.get('/check-token', authUser);

module.exports = Router;
