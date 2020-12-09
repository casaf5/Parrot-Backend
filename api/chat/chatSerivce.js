const ObjectId = require('mongodb').ObjectId;
const { getCollection } = require('../../services/dbService');

async function getChannelById(id) {
	try {
		const collection = await getCollection('channel');
		const channel = await collection.findOne({ _id: ObjectId(id) });
		return channel;
	} catch (err) {
		console.log(err);
	}
}
//TODO CHECK IF I SHOULD SEND ONLY THE RELEVANT DATA?

async function updateChannel(channel) {
	channel._id = ObjectId(channel._id);
	try {
		const collection = await getCollection('channel');
		const updatedChannel = await collection.replaceOne({ _id: channel._id }, { ...channel });
		return updatedChannel;
	} catch (err) {
		console.log(err);
	}
}

async function createChannel(channel) {
	try {
		const collection = await getCollection('channel');
		const actionData = await collection.insertOne(channel);
		return actionData.ops[0];
	} catch (err) {
		console.log(err);
	}
}

async function removeChannel(id) {
	const collection = await getCollection('channel');
	try {
		await collection.deleteOne({ _id: ObjectId(id) });
	} catch (err) {
		console.log(err);
	}
}

async function getDirectMsgById(fromUser, toUser) {
	//!the messages will be searched by the user id connected//(JWT)
	try {
		const collection = await getCollection('user');
		const user = await collection.findOne({ _id: ObjectId(fromUser) });
		const directMsgData = user.directMessages.find((dirMsg) => dirMsg._id === toUser);
		return directMsgData;
	} catch (err) {
		console.log(err);
	}
}

async function updateDirectMsgData(chatData, userId) {
	try {
		const collection = await getCollection('user');
		const updatedChat = await collection.updateOne(
			{ _id: ObjectId(userId) },
			{ $set: { directMessages: chatData } }
		);
		return updatedChat;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getChannelById,
	updateChannel,
	createChannel,
	getDirectMsgById,
	updateDirectMsgData,
	removeChannel,
};
