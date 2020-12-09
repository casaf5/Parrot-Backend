const chatService = require('./chatSerivce');
const userService = require('../user/userService');

async function getChannelData(req, res) {
	const { id } = req.params;
	const channel = await chatService.getChannelById(id);
	res.json(channel);
}

async function updateChannelData(req, res) {
	const channel = req.body;
	const updatedChannel = await chatService.updateChannel(channel);
	res.json(updatedChannel);
}

async function createChannel(req, res) {
	const channel = req.body;
	const newChannel = await chatService.createChannel(channel);
	res.json(newChannel);
}

async function getDirectMessagesData(req, res) {
	const { userId } = req;
	const directMsgToUser = req.params.toUserId;
	const dirMsgData = await chatService.getDirectMsgById(userId, directMsgToUser);
	res.json(dirMsgData);
}

async function removeChannel(req, res) {
	const { id } = req.params;
	await chatService.removeChannel(id);
	await userService.removeChannelFromUsers(id);
	res.send(`Deleted chat- ${id}`);
}

async function updateDirectMsgData(req, res) {
	//!FIX THIS UGLY THINGGGG
	const directMsgData = req.body;
	const { userId } = req;
	const { toUserId } = req.params;
	const sender = await userService.getUserById(userId);
	const getter = await userService.getUserById(toUserId);
	let senderPrivateMsg = _insertNewChatData(sender, directMsgData);
	let getterPrivateMsg = _insertNewChatData(getter, {
		...directMsgData,
		directMsgName: sender.preferences.nickName,
	});
	await chatService.updateDirectMsgData(senderPrivateMsg, userId);
	await chatService.updateDirectMsgData(getterPrivateMsg, toUserId);
	res.end();
}

function _insertNewChatData(user, directChatData) {
	const idx = user.directMessages.findIndex((dirMsg) => dirMsg._id === directChatData._id);
	if (idx === -1) {
		user.directMessages.push(directChatData);
	} else {
		user.directMessages.splice(idx, 1, directChatData);
	}
	return user.directMessages;
}

module.exports = {
	getChannelData,
	updateChannelData,
	createChannel,
	getDirectMessagesData,
	updateDirectMsgData,
	removeChannel,
};
