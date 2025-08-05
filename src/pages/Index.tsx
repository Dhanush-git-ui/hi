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
  const [gameMode, setGameMode] = useState<'local' | 'host' | 'join'>('local');
  const [joinGameId, setJoinGameId] = useState('');
  const [hostName, setHostName] = useState('');
  
  const {
    gameState,
    selectedProperty,
    initializeGame,
    rollDice,
    buyProperty,
    endTurn,
    handleTileClick,
    canRollDice,
    canBuyProperty,
    createGame,
    joinGame,
    isConnected,
    gameId
  } = useGameState();

  const handleStartGame = async () => {
    if (gameMode === 'local') {
      if (playerNames.length < 2) {
        toast.error('Need at least 2 players!');
        return;
      }
      initializeGame(playerNames);
      setGameStarted(true);
    } else if (gameMode === 'host') {
      if (!hostName.trim()) {
        toast.error('Please enter your name!');
        return;
      }
      const newGameId = await createGame(hostName);
      if (newGameId) {
        setGameStarted(true);
      }
    } else if (gameMode === 'join') {
      if (!joinGameId.trim() || !hostName.trim()) {
        toast.error('Please enter game ID and your name!');
        return;
      }
      await joinGame(joinGameId, hostName);
      setGameStarted(true);
    }
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
            <div className="text-sm mt-2 text-foreground/60">
              Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>

          {/* Game Mode Selection */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">Game Mode</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={gameMode === 'local' ? 'default' : 'outline'}
                onClick={() => setGameMode('local')}
                size="sm"
              >
                Local
              </Button>
              <Button
                variant={gameMode === 'host' ? 'default' : 'outline'}
                onClick={() => setGameMode('host')}
                size="sm"
                disabled={!isConnected}
              >
                Host
              </Button>
              <Button
                variant={gameMode === 'join' ? 'default' : 'outline'}
                onClick={() => setGameMode('join')}
                size="sm"
                disabled={!isConnected}
              >
                Join
              </Button>
            </div>
          </div>

          {gameMode === 'local' && (
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
              {playerNames.length < 6 && (
                <Button variant="secondary" onClick={addPlayer} className="w-full">
                  Add Player
                </Button>
              )}
            </div>
          )}

          {(gameMode === 'host' || gameMode === 'join') && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-foreground">Your Name</label>
                <Input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
              
              {gameMode === 'join' && (
                <div>
                  <label className="text-sm font-medium text-foreground">Game ID</label>
                  <Input
                    value={joinGameId}
                    onChange={(e) => setJoinGameId(e.target.value)}
                    placeholder="Enter game ID"
                    className="mt-1"
                  />
                </div>
              )}

              {gameId && (
                <div className="p-3 bg-card/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Game ID: {gameId}</p>
                  <p className="text-xs text-foreground/60">Share this with friends</p>
                </div>
              )}
            </div>
          )}
          
          <Button onClick={handleStartGame} className="w-full neon-glow">
            {gameMode === 'local' && 'Start Local Game'}
            {gameMode === 'host' && 'Create Game'}
            {gameMode === 'join' && 'Join Game'}
          </Button>
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
