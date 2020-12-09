const userService = require('./userService');

async function getUser(req, res) {
	const { id } = req.params;
	const user = await userService.getUserById(id);
	res.json(user);
}

async function updateUser(req, res) {
	const user = req.body;
	const updatedUser = await userService.updateUser(user);
	delete updateUser.password;
	res.json(updatedUser);
}



module.exports = {
	getUser,
	updateUser,
};
