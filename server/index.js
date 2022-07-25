import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8081 }, () => console.log('Server running on port 8081!'));

const users = new Set();
const recentMsgs = [];

const sendMessage = (message) => {
	for (const user of users) {
		user.socket.send(JSON.stringify(message));
	}
};

server.on('connection', (socket) => {
    console.log('New user connected!');

    const userRef = { socket };
    users.add(userRef);

    socket.on('message', (message) => {
        // 1. When a msg is received
        try {
            // 2. ...attempt to parse it,
            const parsedMessage = JSON.parse(message);

            // 3. then ensure that it is a valid message
            if (typeof parsedMessage.sender !== 'string' || typeof parsedMessage.body !== 'string') {
                console.error('Invalid message received', message);
                return;
            }

            const numberOfRecentMsgs = recentMsgs.filter(msg => msg.sender === parsedMessage.sender).length;
            if (numberOfRecentMsgs >= 10) {
                socket.close(4000, 'flooding the chat');
                return;
            }

            // 4. and if it is, send it!
			const verifiedMessage = {
				sender: parsedMessage.sender,
				body: parsedMessage.body,
				sentAt: Date.now(),
			}
            sendMessage(verifiedMessage);

            recentMsgs.push(verifiedMessage);
            setTimeout(() => recentMsgs.shift(), 60000)
        } catch (error) {
            // If the message wasn't valid JSON, JSON.parse would throw an error
            console.error('Error parsing message', error)
        }
    });

    socket.on('close', (code, reason) => {
        console.log(`User disconnected with code ${code} and reason ${reason}!`);
		users.delete(userRef);
    })
});