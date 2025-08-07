// const handleVoiceOperations = (socket, io) => {
//   const connections = {};
//   const timeOnline = {};

//   socket.on("join-call", (path) => {
//     console.log("trying to join the call");
//     if (connections[path] === undefined) {
//       connections[path] = [];
//     }
//     connections[path].push(socket.id);

//     timeOnline[socket.id] = new Date();

//     for (let a = 0; a < connections[path].length; a++) {
//       console.log("someone joined the call");
//       io.to(connections[path][a]).emit(
//         "user-joined",
//         socket.id,
//         connections[path]
//       );
//     }
//   });

//   socket.on("signal", (toId, message) => {
//     io.to(toId).emit("signal", socket.id, message);
//   });
// };

// export { handleVoiceOperations };
