import { io, Socket } from 'socket.io-client';
import { GameState, Player } from '@/types/game';

class SocketService {
  private socket: Socket | null = null;
  private gameId: string | null = null;

  connect() {
    // For development, use localhost. In production, this would be your backend URL
    this.socket = io('http://localhost:3001', {
      autoConnect: false
    });
    
    this.socket.connect();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  createGame(hostName: string): Promise<{ gameId: string; playerId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('create-game', { hostName });
      
      this.socket.once('game-created', (data) => {
        this.gameId = data.gameId;
        resolve(data);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  joinGame(gameId: string, playerName: string): Promise<{ playerId: string; gameState: GameState }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('join-game', { gameId, playerName });
      
      this.socket.once('game-joined', (data) => {
        this.gameId = gameId;
        resolve(data);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  startGame(): Promise<GameState> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error('Socket not connected or no game'));
        return;
      }

      this.socket.emit('start-game', { gameId: this.gameId });
      
      this.socket.once('game-started', (gameState) => {
        resolve(gameState);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  rollDice(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error('Socket not connected or no game'));
        return;
      }

      this.socket.emit('roll-dice', { gameId: this.gameId });
      
      this.socket.once('dice-rolled', (dice) => {
        resolve(dice);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  buyProperty(propertyId: number): Promise<GameState> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error('Socket not connected or no game'));
        return;
      }

      this.socket.emit('buy-property', { gameId: this.gameId, propertyId });
      
      this.socket.once('property-bought', (gameState) => {
        resolve(gameState);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  endTurn(): Promise<GameState> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId) {
        reject(new Error('Socket not connected or no game'));
        return;
      }

      this.socket.emit('end-turn', { gameId: this.gameId });
      
      this.socket.once('turn-ended', (gameState) => {
        resolve(gameState);
      });

      this.socket.once('error', (error) => {
        reject(error);
      });
    });
  }

  onGameUpdate(callback: (gameState: GameState) => void) {
    if (this.socket) {
      this.socket.on('game-update', callback);
    }
  }

  onPlayerJoined(callback: (player: Player) => void) {
    if (this.socket) {
      this.socket.on('player-joined', callback);
    }
  }

  onPlayerLeft(callback: (playerId: string) => void) {
    if (this.socket) {
      this.socket.on('player-left', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  getCurrentGameId() {
    return this.gameId;
  }
}

export const socketService = new SocketService();