const jwt = require('jsonwebtoken');

async function requireAuth(req, res, next) {
	const token = req.cookies.jwt;
	if (token) {
		const tokenData = jwt.verify(token, process.env.TOKEN_KEY);
		if (tokenData) {
			req.userId = tokenData.userId;
			next();
		} else {
			res.status(401).send('Token Auth faild, please login again...');
		}
	} else {
		res.status(403).send('No Token , login to continue...');
	}
}
module.exports = {
	requireAuth,
};
