'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameRoom, Player, GameState } from '@/types/game';

interface SocketContextType {
  socket: Socket | null;
  gameState: GameState;
  joinRoom: (roomId: string, playerName: string) => void;
  makeMove: (roomId: string, cellIndex: number) => void;
  resetGame: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    room: null,
    player: null,
    isConnected: false,
    error: null,
  });

  useEffect(() => {
    const socketInstance = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3000');

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setGameState(prev => ({ ...prev, isConnected: true, error: null }));
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setGameState(prev => ({ ...prev, isConnected: false }));
    });

    socketInstance.on('room-joined', (data: { roomId: string; player: Player; room: GameRoom }) => {
      setGameState(prev => ({
        ...prev,
        room: data.room,
        player: data.player,
        error: null,
      }));
    });

    socketInstance.on('player-joined', (data: { player: Player; room: GameRoom }) => {
      setGameState(prev => ({
        ...prev,
        room: data.room,
      }));
    });

    socketInstance.on('game-started', (room: GameRoom) => {
      setGameState(prev => ({
        ...prev,
        room,
      }));
    });

    socketInstance.on('move-made', (data: { room: GameRoom; cellIndex: number; symbol: string }) => {
      setGameState(prev => ({
        ...prev,
        room: data.room,
      }));
    });

    socketInstance.on('player-left', (room: GameRoom) => {
      setGameState(prev => ({
        ...prev,
        room,
      }));
    });

    socketInstance.on('game-reset', (room: GameRoom) => {
      setGameState(prev => ({
        ...prev,
        room,
      }));
    });

    socketInstance.on('room-full', () => {
      setGameState(prev => ({
        ...prev,
        error: 'Room is full. Please try another room.',
      }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, playerName: string) => {
    if (socket) {
      socket.emit('join-room', roomId, playerName);
    }
  };

  const makeMove = (roomId: string, cellIndex: number) => {
    if (socket) {
      socket.emit('make-move', roomId, cellIndex);
    }
  };

  const resetGame = (roomId: string) => {
    if (socket) {
      socket.emit('reset-game', roomId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, gameState, joinRoom, makeMove, resetGame }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}