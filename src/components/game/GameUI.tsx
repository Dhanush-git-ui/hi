import React, { useState } from 'react';
import { Player, Property } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PlayerToken } from './PlayerToken';
import { ChevronDown, ChevronUp, Crown, Lock, Home, Users, TrendingUp } from 'lucide-react';

interface GameUIProps {
  players: Player[];
  currentPlayer: Player;
  selectedProperty?: Property;
  onBuyProperty: () => void;
  onEndTurn: () => void;
  onPayRent?: () => void;
  onUseCard?: () => void;
  onTrade?: () => void;
  canBuyProperty: boolean;
  canPayRent?: boolean;
  canUseCard?: boolean;
  canTrade?: boolean;
}

export const GameUI: React.FC<GameUIProps> = ({
  players,
  currentPlayer,
  selectedProperty,
  onBuyProperty,
  onEndTurn,
  onPayRent,
  onUseCard,
  onTrade,
  canBuyProperty,
  canPayRent = false,
  canUseCard = false,
  canTrade = false
}) => {
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());

  const togglePlayerExpansion = (playerId: string) => {
    const newExpanded = new Set(expandedPlayers);
    if (newExpanded.has(playerId)) {
      newExpanded.delete(playerId);
    } else {
      newExpanded.add(playerId);
    }
    setExpandedPlayers(newExpanded);
  };

  const getPlayerNetWorth = (player: Player) => {
    const propertyValue = player.properties.reduce((total, propId) => {
      const property = selectedProperty?.id === propId ? selectedProperty : undefined;
      return total + (property?.price || 0);
    }, 0);
    return player.money + propertyValue;
  };

  const getLeaderboard = () => {
    return [...players].sort((a, b) => getPlayerNetWorth(b) - getPlayerNetWorth(a));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Players Panel */}
      <Card className="bg-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neon flex items-center gap-2">
            <Users className="w-5 h-5" />
            Players
          </h3>
          <Badge variant="secondary" className="text-xs">
            {players.length} Players
          </Badge>
        </div>
        
        <div className="space-y-4">
          {players.map((player, index) => {
            const isExpanded = expandedPlayers.has(player.id);
            const isCurrentPlayer = player.id === currentPlayer.id;
            const netWorth = getPlayerNetWorth(player);
            const rank = getLeaderboard().findIndex(p => p.id === player.id) + 1;
            
            return (
              <Collapsible 
                key={player.id}
                open={isExpanded}
                onOpenChange={() => togglePlayerExpansion(player.id)}
              >
                <div className={`rounded-lg transition-all duration-300 ${
                  isCurrentPlayer ? 'bg-primary/20 neon-border' : 'bg-card/50'
                }`}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <PlayerToken player={player} size="md" />
                          {rank === 1 && (
                            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{player.name}</span>
                            {isCurrentPlayer && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                            {player.inJail && (
                              <Lock className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.properties.length} properties
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-gold font-semibold">₹{player.money.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            Net: ₹{netWorth.toLocaleString()}
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {/* Owned Properties */}
                      <div className="bg-accent/10 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          Owned Properties
                        </h4>
                        {player.properties.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {player.properties.map(propId => {
                              const property = selectedProperty?.id === propId ? selectedProperty : undefined;
                              return property ? (
                                <div key={propId} className="text-xs bg-card/50 rounded p-2">
                                  <div className="font-medium">{property.name}</div>
                                  <div className="text-gold">₹{property.price.toLocaleString()}</div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">No properties owned</div>
                        )}
                      </div>
                      
                      {/* Jail Status */}
                      {player.inJail && (
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-destructive">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm font-medium">In Jail</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Turns remaining: {player.jailTurns}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </Card>

      {/* Property Details */}
      {selectedProperty && selectedProperty.type === 'property' && (
        <Card className="bg-glass p-6">
          <h3 className="text-xl font-bold text-neon mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Property Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-foreground">Name:</span>
              <span className="font-semibold">{selectedProperty.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">State:</span>
              <span className="font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                {selectedProperty.state}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Price:</span>
              <span className="text-gold font-semibold">₹{selectedProperty.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Rent:</span>
              <span className="text-gold">₹{selectedProperty.rent[0]}</span>
            </div>
            {selectedProperty.owner ? (
              <div className="flex justify-between items-center">
                <span className="text-foreground">Owner:</span>
                <span className="text-accent font-semibold">
                  {players.find(p => p.id === selectedProperty.owner)?.name}
                </span>
              </div>
            ) : (
              canBuyProperty && (
                <Button 
                  onClick={onBuyProperty}
                  className="w-full mt-4 neon-glow bg-green-600 hover:bg-green-700"
                  disabled={currentPlayer.money < selectedProperty.price}
                >
                  💰 Buy Property
                </Button>
              )
            )}
          </div>
        </Card>
      )}

      {/* Dynamic Action Buttons */}
      <Card className="bg-glass p-6">
        <h3 className="text-xl font-bold text-neon mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Actions
        </h3>
        <div className="space-y-3">
          {canBuyProperty && (
            <Button 
              onClick={onBuyProperty}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              💰 Buy Property
            </Button>
          )}
          
          {canPayRent && onPayRent && (
            <Button 
              onClick={onPayRent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              💸 Pay Rent
            </Button>
          )}
          
          {canUseCard && onUseCard && (
            <Button 
              onClick={onUseCard}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              🎴 Use Card
            </Button>
          )}
          
          {canTrade && onTrade && (
            <Button 
              onClick={onTrade}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🤝 Trade
            </Button>
          )}
          
          <Button 
            onClick={onEndTurn}
            variant="secondary"
            className="w-full font-bold"
          >
            ⏭️ End Turn
          </Button>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-glass p-6">
        <h3 className="text-xl font-bold text-neon mb-4">🏆 Leaderboard</h3>
        <div className="space-y-2">
          {getLeaderboard().map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 rounded bg-card/30">
              <div className="flex items-center gap-2">
                <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}</span>
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="text-gold font-semibold">₹{getPlayerNetWorth(player).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};