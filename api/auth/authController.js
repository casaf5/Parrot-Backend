const authService = require('../auth/authService');
const userService = require('../user/userService');
const workSpaceService = require('../workspace/workSpaceService');
const jwt = require('jsonwebtoken');

const MAX_AGE = 60 * 60 * 24 * 1;


async function login(req, res) {
	const credentials = req.body;
	try {
		const loggedUser = await authService.loginAuth(credentials);
		const token = _createToken(loggedUser._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
		delete loggedUser.password;
		res.json(loggedUser);
	} catch (err) {
		res.status(401).json({ err: err.message });
	}
}

async function signup(req, res) {
	const credentials = req.body;
	try {
		const user = await userService.addUser(credentials);
		await workSpaceService.addUserToWorkSpace(user);
		const token = _createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
		delete user.password;
		res.json(user);
	} catch (err) {
		res.json({ err: err.message });
	}
}
async function authUser(req, res) {
	const token = req.cookies.jwt;
	if (token) {
		const auth = jwt.verify(token, process.env.TOKEN_KEY);
		if (auth) {
			const user = await userService.getUserById(auth.userId);
			delete user.password;
			res.json({ user });
		} else {
			res.json({ err: 'Token auth failed' });
		}
	} else {
		res.json({ err: 'No Token, Please log in...' });
	}
}

module.exports = {
	login,
	signup,
	authUser,
};

function _createToken(userId) {
	return jwt.sign({ userId }, process.env.TOKEN_KEY, { expiresIn: MAX_AGE });
}
