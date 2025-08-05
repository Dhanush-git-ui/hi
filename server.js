const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state storage
const games = new Map();
const players = new Map();

// Game data
const BOARD_PROPERTIES = [
  { id: 0, name: 'START', state: '', type: 'special', tier: 1, price: 0, rent: [2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  { id: 1, name: 'Maharashtra', state: 'Mumbai', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 2, name: 'Surprise', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  { id: 3, name: 'Tamil Nadu', state: 'Chennai', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 4, name: 'Income Tax', state: '', type: 'special', tier: 1, price: 0, rent: [200], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  { id: 5, name: 'Delhi Airport', state: 'Delhi', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  { id: 6, name: 'JAIL', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--destructive))' },
  { id: 7, name: 'Gujarat', state: 'Ahmedabad', type: 'property', tier: 1, price: 5500, rent: [550, 1100, 3300, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 8, name: 'Electric Board', state: '', type: 'utility', tier: 1, price: 1500, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-orange))' },
  { id: 9, name: 'Karnataka', state: 'Bangalore', type: 'property', tier: 1, price: 5500, rent: [550, 1100, 3300, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 10, name: 'Uttar Pradesh', state: 'Lucknow', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 11, name: 'Mumbai Airport', state: 'Mumbai', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  { id: 12, name: 'VACATION', state: '', type: 'special', tier: 1, price: 0, rent: [500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--accent))' },
  { id: 13, name: 'Telangana', state: 'Hyderabad', type: 'property', tier: 2, price: 5000, rent: [500, 1000, 3000, 7500, 9250], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 14, name: 'Kerala', state: 'Kochi', type: 'property', tier: 2, price: 5000, rent: [500, 1000, 3000, 7500, 9250], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 15, name: 'Treasure', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  { id: 16, name: 'West Bengal', state: 'Kolkata', type: 'property', tier: 2, price: 5200, rent: [520, 1040, 3120, 7800, 9500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 17, name: 'Kolkata Airport', state: 'Kolkata', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  { id: 18, name: 'GO TO JAIL', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--destructive))' },
  { id: 19, name: 'Punjab', state: 'Chandigarh', type: 'property', tier: 2, price: 4800, rent: [480, 960, 2880, 7200, 8800], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 20, name: 'Rajasthan', state: 'Jaipur', type: 'property', tier: 3, price: 4000, rent: [400, 800, 2400, 6000, 7500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier3))' },
  { id: 21, name: 'Water Board', state: '', type: 'utility', tier: 1, price: 1500, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-orange))' },
  { id: 22, name: 'Andhra Pradesh', state: 'Amaravati', type: 'property', tier: 3, price: 4200, rent: [420, 840, 2520, 6300, 7700], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier3))' },
  { id: 23, name: 'Chennai Airport', state: 'Chennai', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
];

const PLAYER_TOKENS = [
  { id: 'rocket', name: 'Rocket', emoji: '🚀', color: 'hsl(0 85% 60%)' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', color: 'hsl(220 85% 55%)' },
  { id: 'train', name: 'Bullet Train', emoji: '🚄', color: 'hsl(120 85% 55%)' },
  { id: 'rickshaw', name: 'Auto Rickshaw', emoji: '🛺', color: 'hsl(45 100% 50%)' },
  { id: 'lotus', name: 'Lotus', emoji: '🪷', color: 'hsl(280 85% 55%)' },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', color: 'hsl(15 100% 55%)' },
];

function generateGameId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function createGameState(gameId, hostPlayer) {
  return {
    id: gameId,
    players: [hostPlayer],
    currentPlayerIndex: 0,
    dice: [1, 1],
    phase: 'waiting',
    properties: [...BOARD_PROPERTIES],
    surpriseCards: [],
    treasureCards: []
  };
}

function createPlayer(playerId, name, tokenIndex) {
  const token = PLAYER_TOKENS[tokenIndex];
  return {
    id: playerId,
    name,
    token: token.id,
    position: 0, // All players start at START
    money: 15000,
    properties: [],
    inJail: false,
    jailTurns: 0,
    isActive: true,
    color: token.color
  };
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('create-game', ({ hostName }) => {
    const gameId = generateGameId();
    const hostPlayer = createPlayer(socket.id, hostName, 0);
    const gameState = createGameState(gameId, hostPlayer);
    
    games.set(gameId, gameState);
    players.set(socket.id, { gameId, playerIndex: 0 });
    
    socket.join(gameId);
    
    socket.emit('game-created', { gameId, playerId: socket.id });
    console.log(`Game created: ${gameId} by ${hostName}`);
  });

  socket.on('join-game', ({ gameId, playerName }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (game.players.length >= 6) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }
    
    if (game.phase !== 'waiting') {
      socket.emit('error', { message: 'Game already started' });
      return;
    }
    
    const playerIndex = game.players.length;
    const newPlayer = createPlayer(socket.id, playerName, playerIndex);
    game.players.push(newPlayer);
    
    players.set(socket.id, { gameId, playerIndex });
    socket.join(gameId);
    
    socket.emit('game-joined', { playerId: socket.id, gameState: game });
    io.to(gameId).emit('player-joined', newPlayer);
    io.to(gameId).emit('game-update', game);
    
    console.log(`Player ${playerName} joined game ${gameId}`);
  });

  socket.on('start-game', ({ gameId }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    if (game.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players' });
      return;
    }
    
    // Ensure all players start at position 0 (START)
    game.players.forEach(player => {
      player.position = 0;
    });
    
    game.phase = 'rolling';
    games.set(gameId, game);
    
    io.to(gameId).emit('game-started', game);
    io.to(gameId).emit('game-update', game);
    
    console.log(`Game ${gameId} started with ${game.players.length} players`);
  });

  socket.on('roll-dice', ({ gameId }) => {
    const game = games.get(gameId);
    const playerInfo = players.get(socket.id);
    
    if (!game || !playerInfo) {
      socket.emit('error', { message: 'Game or player not found' });
      return;
    }
    
    if (game.phase !== 'rolling') {
      socket.emit('error', { message: 'Not your turn to roll' });
      return;
    }
    
    if (playerInfo.playerIndex !== game.currentPlayerIndex) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }
    
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    
    game.dice = dice;
    game.phase = 'moving';
    
    // Move player
    const currentPlayer = game.players[game.currentPlayerIndex];
    const steps = dice[0] + dice[1];
    const newPosition = (currentPlayer.position + steps) % 24;
    const passedStart = newPosition < currentPlayer.position;
    
    currentPlayer.position = newPosition;
    if (passedStart) {
      currentPlayer.money += 2000;
    }
    
    game.phase = 'action';
    games.set(gameId, game);
    
    io.to(gameId).emit('dice-rolled', dice);
    io.to(gameId).emit('game-update', game);
    
    console.log(`Player ${currentPlayer.name} rolled ${dice[0]} + ${dice[1]} = ${steps}`);
  });

  socket.on('buy-property', ({ gameId, propertyId }) => {
    const game = games.get(gameId);
    const playerInfo = players.get(socket.id);
    
    if (!game || !playerInfo) {
      socket.emit('error', { message: 'Game or player not found' });
      return;
    }
    
    const property = game.properties[propertyId];
    const currentPlayer = game.players[game.currentPlayerIndex];
    
    if (property.owner || property.type !== 'property') {
      socket.emit('error', { message: 'Property not available' });
      return;
    }
    
    if (currentPlayer.money < property.price) {
      socket.emit('error', { message: 'Not enough money' });
      return;
    }
    
    currentPlayer.money -= property.price;
    currentPlayer.properties.push(propertyId);
    property.owner = currentPlayer.id;
    
    games.set(gameId, game);
    
    io.to(gameId).emit('property-bought', game);
    io.to(gameId).emit('game-update', game);
    
    console.log(`Player ${currentPlayer.name} bought ${property.name}`);
  });

  socket.on('end-turn', ({ gameId }) => {
    const game = games.get(gameId);
    const playerInfo = players.get(socket.id);
    
    if (!game || !playerInfo) {
      socket.emit('error', { message: 'Game or player not found' });
      return;
    }
    
    if (playerInfo.playerIndex !== game.currentPlayerIndex) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }
    
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    game.phase = 'rolling';
    
    games.set(gameId, game);
    
    io.to(gameId).emit('turn-ended', game);
    io.to(gameId).emit('game-update', game);
    
    console.log(`Turn ended, now player ${game.players[game.currentPlayerIndex].name}'s turn`);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      const game = games.get(playerInfo.gameId);
      if (game) {
        // Remove player from game
        game.players = game.players.filter(p => p.id !== socket.id);
        
        if (game.players.length === 0) {
          games.delete(playerInfo.gameId);
          console.log(`Game ${playerInfo.gameId} deleted (no players left)`);
        } else {
          games.set(playerInfo.gameId, game);
          io.to(playerInfo.gameId).emit('player-left', socket.id);
          io.to(playerInfo.gameId).emit('game-update', game);
        }
      }
      players.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});