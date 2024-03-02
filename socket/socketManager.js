module.exports = function setupSocket(server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:8000", // Allow only your client app's origin
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

 
};
