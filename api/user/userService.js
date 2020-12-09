const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const { getCollection } = require('../../services/dbService');

async function getUserById(id) {
	try {
		const collection = await getCollection('user');
		const user = await collection.findOne({ _id: ObjectId(id) });
		return user;
	} catch (err) {
		console.log(err);
	}
}

async function updateUser(user) {
	user._id = ObjectId(user._id);
	try {
		const collection = await getCollection('user');
		const userToUpdate = await collection.findOne({ _id: user._id });
		const newUserData = await collection.replaceOne(
			{ _id: user._id },
			{ ...user, password: userToUpdate.password }
		);
		return newUserData;
	} catch (err) {
		console.log(err);
	}
}

async function addUser({ email, password }) {
	const collection = await getCollection('user');
	const checkUser = await collection.findOne({ email });
	if (checkUser) throw Error('email alreay registered...');
	else {
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(password, salt);
		const newUser = newUserFormat(hashPassword, email);
		const addedUser = await collection.insertOne(newUser);
		return addedUser.ops[0];
	}
}

async function addUserToChannel(channel, userId) {
	const collection = await getCollection('user');
	try {
		const res = await collection.findOneAndUpdate(
			{ _id: ObjectId(userId) },
			{ $push: { channels: channel } },
			{ returnOriginal: false }
		);
		return res.value;
	} catch (error) {}
}

async function removeChannelFromUsers(_id, fromUserId) {
	console.log('channel to remove:', _id);
	const collection = await getCollection('user');
	try {
		if (fromUserId) {
			let updatedUser = await collection.findOneAndUpdate(
				{ _id: ObjectId(fromUserId) },
				{ $pull: { channels: { _id } } },
				{ returnOriginal: false }
			);
			return updatedUser.value;
		}
		await collection.update({}, { $pull: { channels: { _id } } }, { multi: true });
	} catch (error) {}
}

module.exports = {
	getUserById,
	updateUser,
	addUser,
	addUserToChannel,
	removeChannelFromUsers,
};

const newUserFormat = (password, email) => {
	return {
		email,
		password,
		preferences: {
			avatarImg: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-10.jpg',
			nickName: email,
		},
		channels: [],
		directMessages: [],
	};
};
