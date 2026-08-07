const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`👋 Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSockets;
