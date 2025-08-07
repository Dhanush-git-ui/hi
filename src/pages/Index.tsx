import React, { useState } from 'react';
import { EnhancedGameUI } from '@/components/game/EnhancedGameUI';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { 
  Users, 
  Gamepad2, 
  Globe, 
  UserPlus, 
  Settings,
  Trophy,
  MessageCircle
} from 'lucide-react';

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
      toast.success('🎉 Game started! Welcome to Bharat Business!');
    } else if (gameMode === 'host') {
      if (!hostName.trim()) {
        toast.error('Please enter your name!');
        return;
      }
      const newGameId = await createGame(hostName);
      if (newGameId) {
        setGameStarted(true);
        toast.success('🎮 Game created! Share the ID with friends.');
      }
    } else if (gameMode === 'join') {
      if (!joinGameId.trim() || !hostName.trim()) {
        toast.error('Please enter game ID and your name!');
        return;
      }
      await joinGame(joinGameId, hostName);
      setGameStarted(true);
      toast.success('🎯 Joined the game!');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/20 to-background p-4">
        <Card className="bg-glass p-8 max-w-md w-full border-neon-red/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neon mb-2 animate-pulse">
              🏛️ BHARAT BUSINESS 🏛️
            </h1>
            <p className="text-xl text-gold font-semibold">Indian States Monopoly</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Experience the rich culture and business opportunities of India
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </div>

          {/* Game Mode Selection */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Game Mode
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={gameMode === 'local' ? 'default' : 'outline'}
                onClick={() => setGameMode('local')}
                size="sm"
                className="btn-enhanced"
              >
                <Users className="w-4 h-4 mr-1" />
                Local
              </Button>
              <Button
                variant={gameMode === 'host' ? 'default' : 'outline'}
                onClick={() => setGameMode('host')}
                size="sm"
                disabled={!isConnected}
                className="btn-enhanced"
              >
                <Globe className="w-4 h-4 mr-1" />
                Host
              </Button>
              <Button
                variant={gameMode === 'join' ? 'default' : 'outline'}
                onClick={() => setGameMode('join')}
                size="sm"
                disabled={!isConnected}
                className="btn-enhanced"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Join
              </Button>
            </div>
          </div>

          {gameMode === 'local' && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players ({playerNames.length}/6)
              </h3>
              {playerNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1"
                  />
                  {playerNames.length > 2 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removePlayer(index)}
                      className="btn-enhanced"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {playerNames.length < 6 && (
                <Button 
                  variant="secondary" 
                  onClick={addPlayer} 
                  className="w-full btn-enhanced"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
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
                <div className="p-3 bg-card/50 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">Game ID: {gameId}</p>
                  <p className="text-xs text-muted-foreground">Share this with friends</p>
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleStartGame} 
            className="w-full neon-glow btn-enhanced text-lg py-3"
          >
            {gameMode === 'local' && '🎮 Start Local Game'}
            {gameMode === 'host' && '🌐 Create Game'}
            {gameMode === 'join' && '🎯 Join Game'}
          </Button>

          {/* Game Features Preview */}
          <div className="mt-6 p-4 bg-card/30 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-2">Game Features:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>Leaderboard</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>Chat</span>
              </div>
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3" />
                <span>3D Dice</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Multiplayer</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <EnhancedGameUI
      players={gameState.players}
      currentPlayer={currentPlayer}
      properties={gameState.properties}
      dice={gameState.dice}
      selectedProperty={selectedProperty}
      onTileClick={handleTileClick}
      onRollDice={rollDice}
      onBuyProperty={buyProperty}
      onEndTurn={endTurn}
      canRollDice={canRollDice}
      canBuyProperty={canBuyProperty}
    />
  );
};

export default Index;