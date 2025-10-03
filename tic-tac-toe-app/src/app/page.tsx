'use client';

import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import RoomSelector from '@/components/RoomSelector';
import { SocketProvider } from '@/context/SocketContext';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleGameStart = (room: string, name: string) => {
    setRoomId(room);
    setPlayerName(name);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setRoomId('');
    setPlayerName('');
  };

  return (
    <SocketProvider>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎮 Tic Tac Toe
          </h1>
          <p className="text-xl text-gray-600">
            Play with friends online in real-time!
          </p>
        </div>

        {!gameStarted ? (
          <RoomSelector onGameStart={handleGameStart} />
        ) : (
          <GameBoard 
            roomId={roomId} 
            playerName={playerName}
            onBackToMenu={handleBackToMenu}
          />
        )}
      </main>
    </SocketProvider>
  );
}