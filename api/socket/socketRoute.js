module.exports = connectSockets;
const chatService = require('../chat/chatSerivce');
const userService = require('../user/userService');

const loggedUsers = {};

function connectSockets(io) {
	io.on('connection', (socket) => {
		console.log('New Connection Appered ! ');
		//CONNECT TO NEW CHANNEL/PRIVATE CHAT
		socket.on('connectToChat', (chatDetails, sendChatId) => {
			// let roomName = buildRoomName(chatDetails);
			let roomName = chatDetails._id;
			socket.join(roomName);
			io.to(roomName).emit('newChatConnection', { roomName });
			sendChatId(roomName);
		});
		//DISCONNECT FROM A CHANNEL/PRIVATE CHAT
		socket.on('disconnectedFromChat', (chatToLeave) => {
			if (socket.rooms[chatToLeave]) socket.leave(chatToLeave);
			console.log(`socket ${socket.id} disconnetd from chat ${chatToLeave}`);
		});
		//INDICATION THAT A NEW CHAT MESSAGE HAS BEEN SENT- PRIVATE/CHANNEL
		socket.on('chatUpdated', async ({ chatType, _id, userId }) => {
			var lastUpdatedData =
				chatType === 'channel'
					? await chatService.getChannelById(_id)
					: await chatService.getDirectMsgById(userId, _id);
			socket.to(_id).emit('newMessagesOnChat', { lastUpdatedData });
		});
		//REAL TIME INDICATION THAT SOMEONE IS TYPING- PRIVATE/CHANNEL
		socket.on('chatTyping', ({ _id, userName }) => {
			socket.to(_id).emit('userIsTyping', { userName });
		});
		socket.on('userStoppedTyping', (id) => {
			io.to(id).emit('noTypingInChat');
		});
		socket.on('newUserLoggedToWorkspace', (workSpaceId, userId) => {
			if (!userId) return;
			socket.join(`workspace-${workSpaceId}`);
			let usersList = addLoggedUser(userId, socket.id);
			io.emit('workSpaceUpdate', usersList);
		});
		socket.on('addUserToChannel', async ({ channel, userId }) => {
			const updatedUserData = await userService.addUserToChannel(channel, userId);
			let socketToUpdate = _getSocketByUserId(userId);
			io.to(socketToUpdate).emit('userDataUpdate', updatedUserData);
		});
		socket.on('removeUserFromChannel', async ({ channelId, userId }) => {
			const updatedUserData = await userService.removeChannelFromUsers(channelId, userId);
			let socketToUpdate = _getSocketByUserId(userId);
			io.to(socketToUpdate).emit('userDataUpdate', updatedUserData);
		});
		//CLOSING THE WHOLE APP
		socket.on('disconnect', () => {
			let updatedUsers = removeLoggedUser(socket.id);
			console.log('Disconnected !! ');
			io.emit('workSpaceUpdate', updatedUsers);
		});
	});
}

function _getSocketByUserId(id) {
	const res = Object.entries(loggedUsers).find(([socket, userId]) => userId === id);
	return res ? res[0] : null;
}

function addLoggedUser(user, socketId) {
	if (!loggedUsers[socketId]) loggedUsers[socketId] = user;
	return Object.values(loggedUsers);
}

function removeLoggedUser(socketId) {
	delete loggedUsers[socketId];
	return Object.values(loggedUsers);
}
