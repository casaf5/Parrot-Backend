const Router = require('express').Router();

const { getWorkSpaceData,updateUserInWorkSpace } = require('./workSpaceController');
const { requireAuth } = require('../../middleware/requireAuthMiddleware');

Router.get('/:id', requireAuth, getWorkSpaceData);
Router.put('/update/:id', requireAuth, updateUserInWorkSpace);

module.exports = Router;
