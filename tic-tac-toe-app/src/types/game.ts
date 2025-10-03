export interface Player {
  id: string;
  name: string;
  symbol: 'X' | 'O';
}

export interface GameRoom {
  players: Player[];
  board: (string | null)[];
  currentPlayer: 'X' | 'O';
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: string | null;
  moves: number;
}

export interface GameState {
  room: GameRoom | null;
  player: Player | null;
  isConnected: boolean;
  error: string | null;
}