const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.emit('hi');
  console.log('Client connesso:', socket.id);

  // Esempio di invio di un messaggio al client dopo 5 secondi
  setInterval(() => {
    socket.emit('messaggioDalServer', 'Ciao, questo è un messaggio dal server!');
  }, 5000);

  // Gestisci l'evento 'messaggioDalClient' inviato dal client
  socket.on('messaggioDalClient', (data) => {
    console.log('Messaggio dal client:', data);
  });
});

server.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});
