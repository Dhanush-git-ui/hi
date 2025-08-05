import React from 'react';
import { Player, Property } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayerToken } from './PlayerToken';

interface GameUIProps {
  players: Player[];
  currentPlayer: Player;
  selectedProperty?: Property;
  onBuyProperty: () => void;
  onEndTurn: () => void;
  canBuyProperty: boolean;
}

export const GameUI: React.FC<GameUIProps> = ({
  players,
  currentPlayer,
  selectedProperty,
  onBuyProperty,
  onEndTurn,
  canBuyProperty
}) => {
  return (
    <div className="space-y-4">
      {/* Players Panel */}
      <Card className="bg-glass p-4">
        <h3 className="text-lg font-bold text-neon mb-4">Players</h3>
        <div className="space-y-3">
          {players.map(player => (
            <div 
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                player.id === currentPlayer.id ? 'bg-primary/20 neon-border' : 'bg-card/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlayerToken player={player} size="sm" />
                <div>
                  <div className="font-semibold text-foreground">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {player.properties.length} properties
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gold font-semibold">₹{player.money.toLocaleString()}</div>
                {player.inJail && (
                  <Badge variant="destructive" className="text-xs">In Jail</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Property Details */}
      {selectedProperty && selectedProperty.type === 'property' && (
        <Card className="bg-glass p-4">
          <h3 className="text-lg font-bold text-neon mb-3">Property Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground">Name:</span>
              <span className="font-semibold">{selectedProperty.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Price:</span>
              <span className="text-gold font-semibold">₹{selectedProperty.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Rent:</span>
              <span className="text-gold">₹{selectedProperty.rent[0]}</span>
            </div>
            {selectedProperty.owner ? (
              <div className="flex justify-between">
                <span className="text-foreground">Owner:</span>
                <span className="text-accent">{players.find(p => p.id === selectedProperty.owner)?.name}</span>
              </div>
            ) : (
              canBuyProperty && (
                <Button 
                  onClick={onBuyProperty}
                  className="w-full mt-3 neon-glow"
                  disabled={currentPlayer.money < selectedProperty.price}
                >
                  Buy Property
                </Button>
              )
            )}
          </div>
        </Card>
      )}

      {/* Game Actions */}
      <Card className="bg-glass p-4">
        <h3 className="text-lg font-bold text-neon mb-3">Actions</h3>
        <div className="space-y-2">
          <Button 
            onClick={onEndTurn}
            variant="secondary"
            className="w-full"
          >
            End Turn
          </Button>
        </div>
      </Card>
    </div>
  );
};