require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3030;

//Express Config
const corsOptions = {
	origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
	credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Routes
const chatRoute = require('./api/chat/chatRoute');
app.use('/api/chat', chatRoute);
const authRoute = require('./api/auth/authRoute');
app.use('/api/auth', authRoute);
const userRoute = require('./api/user/userRoute');
app.use('/api/user', userRoute);
const workSpaceRoute = require('./api/workspace/workSpaceRoute');
app.use('/api/workspace', workSpaceRoute);

//Sockets Init
const connectSockets = require('./api/socket/socketRoute');
connectSockets(io);
//Start The Server
http.listen(PORT, () => {
	console.log(`Server listening on PORT ${PORT}`);
});
