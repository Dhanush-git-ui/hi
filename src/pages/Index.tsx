import React, { useState } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { GameUI } from '@/components/game/GameUI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  
  const {
    gameState,
    selectedProperty,
    initializeGame,
    rollDice,
    buyProperty,
    endTurn,
    handleTileClick,
    canRollDice,
    canBuyProperty
  } = useGameState();

  const handleStartGame = () => {
    if (playerNames.length < 2) {
      toast.error('Need at least 2 players!');
      return;
    }
    
    initializeGame(playerNames);
    setGameStarted(true);
  };

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="bg-glass p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neon mb-2">BHARAT BUSINESS</h1>
            <p className="text-lg text-gold">Indian States Monopoly</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">Players ({playerNames.length}/6)</h3>
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="flex-1"
                />
                {playerNames.length > 2 && (
                  <Button variant="destructive" size="sm" onClick={() => removePlayer(index)}>
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            {playerNames.length < 6 && (
              <Button variant="secondary" onClick={addPlayer} className="w-full">
                Add Player
              </Button>
            )}
            
            <Button onClick={handleStartGame} className="w-full neon-glow">
              Start Game
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <div className="lg:col-span-3">
          <GameBoard
            properties={gameState.properties}
            players={gameState.players}
            currentPlayer={currentPlayer}
            dice={gameState.dice}
            onTileClick={handleTileClick}
            onRollDice={rollDice}
            canRollDice={canRollDice}
          />
        </div>
        
        <div className="lg:col-span-1">
          <GameUI
            players={gameState.players}
            currentPlayer={currentPlayer}
            selectedProperty={selectedProperty}
            onBuyProperty={buyProperty}
            onEndTurn={endTurn}
            canBuyProperty={canBuyProperty}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
