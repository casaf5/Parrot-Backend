const bcrypt = require('bcrypt');
const { getCollection } = require('../../services/dbService');

async function loginAuth({ email, password }) {
	const collection = await getCollection('user');
	const user = await collection.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Incorrect password...');
	} else {
		throw Error('Incorrect email...');
	}
}

module.exports = {
	loginAuth,
};
