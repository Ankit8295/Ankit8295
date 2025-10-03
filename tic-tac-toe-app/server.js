const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Game rooms storage
  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create or join a room
    socket.on('join-room', (roomId, playerName) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          players: [],
          board: Array(9).fill(null),
          currentPlayer: 'X',
          gameStatus: 'waiting',
          winner: null,
          moves: 0,
        });
      }

      const room = rooms.get(roomId);
      
      if (room.players.length < 2) {
        const playerSymbol = room.players.length === 0 ? 'X' : 'O';
        const player = { id: socket.id, name: playerName, symbol: playerSymbol };
        room.players.push(player);
        
        socket.emit('room-joined', { roomId, player, room });
        socket.to(roomId).emit('player-joined', { player, room });
        
        if (room.players.length === 2) {
          room.gameStatus = 'playing';
          io.to(roomId).emit('game-started', room);
        }
      } else {
        socket.emit('room-full');
      }
    });

    // Handle moves
    socket.on('make-move', (roomId, cellIndex) => {
      const room = rooms.get(roomId);
      if (!room || room.gameStatus !== 'playing') return;

      const player = room.players.find(p => p.id === socket.id);
      if (!player || player.symbol !== room.currentPlayer) return;

      if (room.board[cellIndex] === null) {
        room.board[cellIndex] = player.symbol;
        room.moves++;

        // Check for winner
        const winner = checkWinner(room.board);
        if (winner) {
          room.gameStatus = 'finished';
          room.winner = winner;
        } else if (room.moves === 9) {
          room.gameStatus = 'finished';
          room.winner = 'draw';
        } else {
          room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
        }

        io.to(roomId).emit('move-made', { room, cellIndex, symbol: player.symbol });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Find and remove player from rooms
      for (const [roomId, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          if (room.players.length === 0) {
            rooms.delete(roomId);
          } else {
            room.gameStatus = 'waiting';
            room.board = Array(9).fill(null);
            room.currentPlayer = 'X';
            room.winner = null;
            room.moves = 0;
            io.to(roomId).emit('player-left', room);
          }
          break;
        }
      }
    });

    // Reset game
    socket.on('reset-game', (roomId) => {
      const room = rooms.get(roomId);
      if (room) {
        room.board = Array(9).fill(null);
        room.currentPlayer = 'X';
        room.gameStatus = room.players.length === 2 ? 'playing' : 'waiting';
        room.winner = null;
        room.moves = 0;
        io.to(roomId).emit('game-reset', room);
      }
    });
  });

  function checkWinner(board) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});