'use client';

import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';

interface RoomSelectorProps {
  onGameStart: (roomId: string, playerName: string) => void;
}

export default function RoomSelector({ onGameStart }: RoomSelectorProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { gameState } = useSocket();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsCreatingRoom(true);
    onGameStart(newRoomId, playerName);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      alert('Please enter both your name and room ID');
      return;
    }
    onGameStart(roomId.toUpperCase(), playerName);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Join a Game
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter room ID"
            maxLength={6}
          />
        </div>

        {gameState.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {gameState.error}
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleJoinRoom}
            disabled={!gameState.isConnected}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {gameState.isConnected ? 'Join Room' : 'Connecting...'}
          </button>

          <div className="text-center text-gray-500">or</div>

          <button
            onClick={handleCreateRoom}
            disabled={!gameState.isConnected}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {gameState.isConnected ? 'Create New Room' : 'Connecting...'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Share the Room ID with a friend to play together!</p>
        </div>
      </div>
    </div>
  );
}