const workSpaceService = require('../workspace/workSpaceService');

async function getWorkSpaceData(req, res) {
	const { id } = req.params;
	const workSpaceData = await workSpaceService.getWorkSpaceById(id, req.userId);
	res.json(workSpaceData);
}
async function updateUserInWorkSpace(req, res) {
	const { id } = req.params;
	const userData = req.body;
	await workSpaceService.updateUserData(id, userData);
	res.end();
}

module.exports = {
	getWorkSpaceData,
	updateUserInWorkSpace
};
