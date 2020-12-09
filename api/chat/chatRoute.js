const Router = require('express').Router();

const {
	getChannelData,
	updateChannelData,
	createChannel,
	getDirectMessagesData,
	updateDirectMsgData,
	removeChannel
} = require('./chatController');

const { requireAuth } = require('../../middleware/requireAuthMiddleware');

Router.get('/:id', requireAuth, getChannelData);
Router.get('/direct/:toUserId', requireAuth, getDirectMessagesData);
Router.put('/direct/:toUserId', requireAuth, updateDirectMsgData);
Router.put('/:id', requireAuth, updateChannelData);
Router.post('/create', requireAuth, createChannel);
Router.delete('/:id', requireAuth, removeChannel);

module.exports = Router;
