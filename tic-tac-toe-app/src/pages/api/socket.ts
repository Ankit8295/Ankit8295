import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIO } from '@/lib/socket';

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : '*',
        methods: ['GET', 'POST'],
      },
    });

    // Game rooms storage
    const rooms = new Map<string, any>();

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Create or join a room
      socket.on('join-room', (roomId: string, playerName: string) => {
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, {
            players: [],
            board: Array(9).fill(null),
            currentPlayer: 'X',
            gameStatus: 'waiting', // waiting, playing, finished
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
      socket.on('make-move', (roomId: string, cellIndex: number) => {
        const room = rooms.get(roomId);
        if (!room || room.gameStatus !== 'playing') return;

        const player = room.players.find((p: any) => p.id === socket.id);
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
          const playerIndex = room.players.findIndex((p: any) => p.id === socket.id);
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
      socket.on('reset-game', (roomId: string) => {
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

    res.socket.server.io = io;
  }
  res.end();
};

function checkWinner(board: (string | null)[]): string | null {
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

export default SocketHandler;