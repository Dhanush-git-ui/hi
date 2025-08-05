import { useState, useCallback } from 'react';
import { GameState, Player, Property } from '@/types/game';
import { BOARD_PROPERTIES, PLAYER_TOKENS } from '@/data/gameData';
import { toast } from 'sonner';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    id: '',
    players: [],
    currentPlayerIndex: 0,
    dice: [1, 1],
    phase: 'waiting',
    properties: BOARD_PROPERTIES,
    surpriseCards: [],
    treasureCards: []
  });

  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);

  const initializeGame = useCallback((playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      token: PLAYER_TOKENS[index].id as any,
      position: 0,
      money: 15000,
      properties: [],
      inJail: false,
      jailTurns: 0,
      isActive: true,
      color: PLAYER_TOKENS[index].color
    }));

    setGameState(prev => ({
      ...prev,
      players,
      phase: 'rolling',
      currentPlayerIndex: 0
    }));

    toast.success('Game started! Roll the dice to begin.');
  }, []);

  const rollDice = useCallback(() => {
    if (gameState.phase !== 'rolling') return;

    const newDice: [number, number] = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    setGameState(prev => ({
      ...prev,
      dice: newDice,
      phase: 'moving'
    }));

    // Simulate player movement after dice roll
    setTimeout(() => {
      movePlayer(newDice[0] + newDice[1]);
    }, 600);
  }, [gameState.phase]);

  const movePlayer = useCallback((steps: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const newPosition = (currentPlayer.position + steps) % 24;
    
    // Check if player passed START
    const passedStart = newPosition < currentPlayer.position;
    
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex] = {
        ...updatedPlayers[prev.currentPlayerIndex],
        position: newPosition,
        money: passedStart ? updatedPlayers[prev.currentPlayerIndex].money + 2000 : updatedPlayers[prev.currentPlayerIndex].money
      };

      return {
        ...prev,
        players: updatedPlayers,
        phase: 'action'
      };
    });

    if (passedStart) {
      toast.success('Passed START! Collected ₹2000');
    }

    // Handle tile action
    const landedProperty = gameState.properties[newPosition];
    handleTileAction(landedProperty);
  }, [gameState]);

  const handleTileAction = useCallback((property: Property) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    switch (property.type) {
      case 'property':
        if (property.owner && property.owner !== currentPlayer.id) {
          // Pay rent
          const rent = property.rent[property.houses];
          payRent(rent, property.owner);
        } else if (!property.owner) {
          // Property available for purchase
          setSelectedTileId(property.id);
          toast.info(`${property.name} is available for ₹${property.price.toLocaleString()}`);
        }
        break;
      case 'special':
        handleSpecialTile(property);
        break;
    }
  }, [gameState]);

  const handleSpecialTile = useCallback((property: Property) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    switch (property.name) {
      case 'Income Tax':
        const tax = Math.min(200, Math.floor(currentPlayer.money * 0.1));
        payTax(tax);
        break;
      case 'GO TO JAIL':
        sendToJail();
        break;
      case 'Vacation':
        collectMoney(500);
        toast.success('Enjoy your vacation! Collected ₹500');
        break;
      case 'Surprise':
        toast.info('Draw a Surprise card!');
        break;
      case 'Treasure':
        toast.info('Draw a Treasure card!');
        break;
    }
  }, [gameState]);

  const payRent = useCallback((amount: number, ownerId: string) => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const ownerIndex = updatedPlayers.findIndex(p => p.id === ownerId);
      
      updatedPlayers[currentPlayerIndex].money -= amount;
      updatedPlayers[ownerIndex].money += amount;

      return { ...prev, players: updatedPlayers };
    });

    const owner = gameState.players.find(p => p.id === ownerId);
    toast.error(`Paid ₹${amount} rent to ${owner?.name}`);
  }, [gameState]);

  const payTax = useCallback((amount: number) => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex].money -= amount;
      return { ...prev, players: updatedPlayers };
    });

    toast.error(`Paid ₹${amount} in taxes`);
  }, []);

  const collectMoney = useCallback((amount: number) => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex].money += amount;
      return { ...prev, players: updatedPlayers };
    });
  }, []);

  const sendToJail = useCallback(() => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex] = {
        ...updatedPlayers[prev.currentPlayerIndex],
        position: 6, // Jail position
        inJail: true,
        jailTurns: 3
      };
      return { ...prev, players: updatedPlayers };
    });

    toast.error('Go to Jail! Miss 3 turns or pay fine');
  }, []);

  const buyProperty = useCallback(() => {
    if (selectedTileId === null) return;
    
    const property = gameState.properties[selectedTileId];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.money < property.price) {
      toast.error('Not enough money!');
      return;
    }

    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      const updatedProperties = [...prev.properties];
      
      updatedPlayers[prev.currentPlayerIndex].money -= property.price;
      updatedPlayers[prev.currentPlayerIndex].properties.push(property.id);
      updatedProperties[selectedTileId].owner = currentPlayer.id;

      return {
        ...prev,
        players: updatedPlayers,
        properties: updatedProperties
      };
    });

    toast.success(`Bought ${property.name} for ₹${property.price.toLocaleString()}`);
    setSelectedTileId(null);
  }, [selectedTileId, gameState]);

  const endTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      phase: 'rolling'
    }));
    setSelectedTileId(null);
  }, []);

  const handleTileClick = useCallback((tileId: number) => {
    setSelectedTileId(tileId);
  }, []);

  return {
    gameState,
    selectedTileId,
    selectedProperty: selectedTileId !== null ? gameState.properties[selectedTileId] : undefined,
    initializeGame,
    rollDice,
    buyProperty,
    endTurn,
    handleTileClick,
    canRollDice: gameState.phase === 'rolling',
    canBuyProperty: gameState.phase === 'action' && selectedTileId !== null && 
                   !gameState.properties[selectedTileId].owner &&
                   gameState.properties[selectedTileId].type === 'property'
  };
};