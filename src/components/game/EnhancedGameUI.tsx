import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { ChatPanel } from './ChatPanel';
import { Player, Property } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Trophy, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'event' | 'system';
}

interface EnhancedGameUIProps {
  players: Player[];
  currentPlayer: Player;
  properties: Property[];
  dice: [number, number];
  selectedProperty?: Property;
  onTileClick: (tileId: number) => void;
  onRollDice: () => void;
  onBuyProperty: () => void;
  onEndTurn: () => void;
  onPayRent?: () => void;
  onUseCard?: () => void;
  onTrade?: () => void;
  canRollDice: boolean;
  canBuyProperty: boolean;
  canPayRent?: boolean;
  canUseCard?: boolean;
  canTrade?: boolean;
}

export const EnhancedGameUI: React.FC<EnhancedGameUIProps> = ({
  players,
  currentPlayer,
  properties,
  dice,
  selectedProperty,
  onTileClick,
  onRollDice,
  onBuyProperty,
  onEndTurn,
  onPayRent,
  onUseCard,
  onTrade,
  canRollDice,
  canBuyProperty,
  canPayRent = false,
  canUseCard = false,
  canTrade = false
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const { toast } = useToast();

  // Initialize with welcome messages
  useEffect(() => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: '1',
        player: 'System',
        message: '🎉 Welcome to Bharat Business - Indian States Monopoly!',
        timestamp: new Date(),
        type: 'system'
      },
      {
        id: '2',
        player: 'System',
        message: '🏛️ Experience the rich culture and business opportunities of India!',
        timestamp: new Date(),
        type: 'system'
      }
    ];
    setChatMessages(welcomeMessages);
  }, []);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      player: currentPlayer.name,
      message,
      timestamp: new Date(),
      type: 'chat'
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const addEventMessage = (message: string) => {
    const eventMessage: ChatMessage = {
      id: Date.now().toString(),
      player: 'System',
      message,
      timestamp: new Date(),
      type: 'event'
    };
    setChatMessages(prev => [...prev, eventMessage]);
  };

  const handleBuyProperty = () => {
    if (selectedProperty) {
      addEventMessage(`💰 ${currentPlayer.name} bought ${selectedProperty.name} for ₹${selectedProperty.price.toLocaleString()}`);
      toast({
        title: "Property Purchased!",
        description: `You now own ${selectedProperty.name}`,
      });
    }
    onBuyProperty();
  };

  const handleRollDice = () => {
    addEventMessage(`🎲 ${currentPlayer.name} rolled ${dice[0]} + ${dice[1]} = ${dice[0] + dice[1]}`);
    onRollDice();
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    toast({
      title: isSoundEnabled ? "Sound Disabled" : "Sound Enabled",
      description: isSoundEnabled ? "Game sounds are now off" : "Game sounds are now on",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-card/20 to-background ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Header */}
      <div className="bg-glass border-b border-border/20 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neon">🏛️ Bharat Business</h1>
            <Badge variant="secondary" className="text-xs">
              {players.length} Players
            </Badge>
            {currentPlayer && (
              <div className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-lg">
                <span className="text-xs text-muted-foreground">Current State:</span>
                <span className="text-sm font-bold text-accent">
                  {(() => {
                    const currentProperty = properties.find(p => p.id === currentPlayer.position);
                    return currentProperty?.state || 'Unknown';
                  })()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSound}
              className="btn-enhanced"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="btn-enhanced"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <GameBoard
              properties={properties}
              players={players}
              currentPlayer={currentPlayer}
              dice={dice}
              onTileClick={onTileClick}
              onRollDice={handleRollDice}
              canRollDice={canRollDice}
              onBuyProperty={handleBuyProperty}
              canBuyProperty={canBuyProperty}
              selectedProperty={selectedProperty}
            />
          </div>

          {/* Sidebar - Takes up 1/3 of the space on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="game" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Game
                </TabsTrigger>
                <TabsTrigger value="players" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Players
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="game" className="space-y-6">
                <GameUI
                  players={players}
                  currentPlayer={currentPlayer}
                  selectedProperty={selectedProperty}
                  onBuyProperty={handleBuyProperty}
                  onEndTurn={onEndTurn}
                  onPayRent={onPayRent}
                  onUseCard={onUseCard}
                  onTrade={onTrade}
                  canBuyProperty={canBuyProperty}
                  canPayRent={canPayRent}
                  canUseCard={canUseCard}
                  canTrade={canTrade}
                />
              </TabsContent>

              <TabsContent value="players" className="space-y-6">
                <Card className="bg-glass p-6">
                  <h3 className="text-xl font-bold text-neon mb-4">👥 Player Details</h3>
                  <div className="space-y-4">
                    {players.map((player) => (
                      <div key={player.id} className="bg-card/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: player.color }} />
                            <span className="font-semibold">{player.name}</span>
                          </div>
                          <Badge variant={player.id === currentPlayer.id ? "default" : "secondary"}>
                            {player.id === currentPlayer.id ? "Current" : "Player"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Cash:</span>
                            <div className="text-gold font-semibold">₹{player.money.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Properties:</span>
                            <div className="font-semibold">{player.properties.length}</div>
                          </div>
                        </div>
                        {player.inJail && (
                          <div className="mt-2 text-destructive text-sm">
                            🔒 In Jail (Turns: {player.jailTurns})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="h-[600px]">
                <ChatPanel
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  currentPlayer={currentPlayer.name}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Overlay */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setActiveTab(activeTab === 'chat' ? 'game' : 'chat')}
          className="rounded-full w-12 h-12 shadow-lg btn-enhanced"
        >
          {activeTab === 'chat' ? <Trophy className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};
