export interface Player {
  id: string;
  name: string;
  token: 'rocket' | 'elephant' | 'train' | 'rickshaw' | 'lotus' | 'tiger';
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
  isActive: boolean;
  color: string;
}

export interface Property {
  id: number;
  name: string;
  state: string;
  type: 'property' | 'special' | 'utility' | 'airport';
  tier: 1 | 2 | 3;
  price: number;
  rent: number[];
  owner?: string;
  houses: number;
  hasHotel: boolean;
  mortgaged: boolean;
  color: string;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, number];
  phase: 'waiting' | 'rolling' | 'moving' | 'action' | 'buying' | 'trading' | 'finished';
  winner?: string;
  properties: Property[];
  surpriseCards: SurpriseCard[];
  treasureCards: TreasureCard[];
}

export interface SurpriseCard {
  id: string;
  title: string;
  description: string;
  effect: string;
  amount?: number;
  emoji: string;
}

export interface TreasureCard {
  id: string;
  title: string;
  description: string;
  effect: string;
  amount?: number;
  emoji: string;
}

export interface GameRoom {
  id: string;
  hostId: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  gameState?: GameState;
}