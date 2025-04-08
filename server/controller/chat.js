import Chat from "../models/Chat.js";

const handleConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Send previous messages on new user connection
        Chat.find().then((messages) => {
            socket.emit('previousMessages', messages);
        });

        // Listen for new messages
        socket.on('message', async (data) => {
            const newMessage = new Chat({ username: data.username, message: data.message });
            await newMessage.save();

            io.emit('message', newMessage);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};


const getMessage = async (req, res) => {
    try {
        const messages = await Chat.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}


export {getMessage, handleConnection}


