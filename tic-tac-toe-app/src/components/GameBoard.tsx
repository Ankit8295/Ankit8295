'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

interface GameBoardProps {
  roomId: string;
  playerName: string;
  onBackToMenu: () => void;
}

export default function GameBoard({ roomId, playerName, onBackToMenu }: GameBoardProps) {
  const { gameState, joinRoom, makeMove, resetGame } = useSocket();

  useEffect(() => {
    if (gameState.isConnected && !gameState.room) {
      joinRoom(roomId, playerName);
    }
  }, [gameState.isConnected, gameState.room, roomId, playerName, joinRoom]);

  const handleCellClick = (index: number) => {
    if (
      gameState.room &&
      gameState.player &&
      gameState.room.gameStatus === 'playing' &&
      gameState.room.board[index] === null &&
      gameState.room.currentPlayer === gameState.player.symbol
    ) {
      makeMove(roomId, index);
    }
  };

  const handleReset = () => {
    resetGame(roomId);
  };

  const getGameStatusMessage = () => {
    if (!gameState.room) return 'Connecting...';

    switch (gameState.room.gameStatus) {
      case 'waiting':
        return 'Waiting for another player to join...';
      case 'playing':
        return gameState.room.currentPlayer === gameState.player?.symbol
          ? "Your turn!"
          : "Opponent's turn";
      case 'finished':
        if (gameState.room.winner === 'draw') {
          return "It's a draw!";
        }
        return gameState.room.winner === gameState.player?.symbol
          ? 'You won! 🎉'
          : 'You lost! 😢';
      default:
        return '';
    }
  };

  const getCellContent = (value: string | null) => {
    if (!value) return '';
    return value === 'X' ? '❌' : '⭕';
  };

  if (!gameState.room) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Game Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Room: {roomId}</h2>
        <p className="text-lg text-gray-600">{getGameStatusMessage()}</p>
      </div>

      {/* Players Info */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Player 1</div>
          <div className="font-semibold text-blue-600">
            {gameState.room.players[0]?.name || 'Waiting...'} ❌
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">vs</div>
          <div className="font-bold text-gray-800">VS</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Player 2</div>
          <div className="font-semibold text-red-600">
            {gameState.room.players[1]?.name || 'Waiting...'} ⭕
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-6 max-w-sm mx-auto">
        {gameState.room.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={
              gameState.room?.gameStatus !== 'playing' ||
              cell !== null ||
              gameState.room?.currentPlayer !== gameState.player?.symbol
            }
            className="aspect-square bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg text-4xl font-bold transition-colors duration-200 flex items-center justify-center"
          >
            {getCellContent(cell)}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div className="flex flex-col space-y-3">
        {gameState.room.gameStatus === 'finished' && (
          <button
            onClick={handleReset}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Play Again
          </button>
        )}
        
        <button
          onClick={onBackToMenu}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Back to Menu
        </button>
      </div>

      {/* Connection Status */}
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          gameState.isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            gameState.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {gameState.isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
}