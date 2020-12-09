const ObjectId = require('mongodb').ObjectId;
const { getCollection } = require('../../services/dbService');
const DEFAULT_WORKSPACE = '5fa1366f47b949c890bbedd6';

async function getWorkSpaceById(id, userId) {
	try {
		const collection = await getCollection('workspace');
		let workspace = await collection.findOne({ _id: ObjectId(id) });
		workspace.sharedUsers = workspace.sharedUsers.map((user) => ({
			...user,
			isOnline: user._id === userId ? true : false,
		}));
		await collection.replaceOne({ _id: ObjectId(id) }, { ...workspace });
		return workspace;
	} catch (err) {
		console.log(err);
	}
}

async function addUserToWorkSpace({ _id, preferences }) {
	const user = {
		_id,
		nickName: preferences.nickName,
		avatarImg: preferences.avatarImg,
	};
	console.log('user', user);
	const collection = await getCollection('workspace');
	try {
		await collection.update({ _id: ObjectId(DEFAULT_WORKSPACE) }, { $push: { sharedUsers: { ...user } } });
	} catch (err) {
		console.log(err);
	}
}

async function updateUserData(id, userData) {
	//id- currently not using, for future support for other workspaces
	userData._id = ObjectId(userData._id);
	console.log('user', userData);
	const collection = await getCollection('workspace');
	try {
		await collection.updateOne(
			{ _id: ObjectId(DEFAULT_WORKSPACE), 'sharedUsers._id': userData._id },
			{ $set: { 'sharedUsers.$': { ...userData } } }
		);
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getWorkSpaceById,
	addUserToWorkSpace,
	updateUserData,
};
