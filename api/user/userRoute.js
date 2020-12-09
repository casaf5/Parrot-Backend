const Router = require('express').Router();
const { getUser, updateUser } = require('./userController');


Router.get('/:id', getUser);
Router.put('/:id', updateUser);

module.exports = Router;
