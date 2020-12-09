//Returning the correct url to DB - Development or Production
const [userName, password] = [process.env.DB_USER_NAME, process.env.DB_PASSWORD];
const dbUrl =
	process.env.NODE_ENV === 'dev'
		? 'mongodb://localhost:27017'
		: `mongodb+srv://${userName}:${password}@cluster0.n9j6d.mongodb.net/parrotDB?retryWrites=true&w=majority
    `;

module.exports = dbUrl;
