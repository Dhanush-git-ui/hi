import React from 'react';
import { Property, Player } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameTileProps {
  property: Property;
  onClick: () => void;
  players: Player[];
}

export const GameTile: React.FC<GameTileProps> = ({ property, onClick, players }) => {
  const isCorner = [0, 6, 12, 18].includes(property.id);
  const isSpecial = property.type === 'special';
  const isOwned = property.owner !== undefined;

  const getTileColor = () => {
    if (property.type === 'special') return 'hsl(var(--special-tile))';
    if (property.type === 'airport') return 'hsl(var(--neon-gold))';
    if (property.type === 'utility') return 'hsl(var(--neon-orange))';
    return property.color;
  };

  const getSpecialIcon = () => {
    switch (property.name) {
      case 'START': return '🏠';
      case 'JAIL': return '🔒';
      case 'VACATION': return '🏖️';
      case 'GO TO JAIL': return '👮';
      case 'Income Tax': return '💰';
      case 'Surprise': return '❓';
      case 'Treasure': return '💎';
      default: return '';
    }
  };

  const getStateEmoji = () => {
    const stateEmojis: { [key: string]: string } = {
      'Maharashtra': '🏙️',
      'Tamil Nadu': '🕺',
      'Gujarat': '🧶',
      'Karnataka': '☕',
      'Uttar Pradesh': '🕌',
      'Telangana': '💎',
      'Kerala': '🥥',
      'West Bengal': '🐟',
      'Punjab': '🌾',
      'Rajasthan': '🐪',
      'Andhra Pradesh': '🌶️',
    };
    return stateEmojis[property.name] || '🏛️';
  };

  return (
    <Card 
      className={`h-full w-full cursor-pointer tile-glow transition-all duration-300 ${
        isCorner ? 'aspect-square' : 'aspect-[3/4]'
      } relative overflow-hidden neon-border bg-tile-bg hover:bg-card/80`}
      onClick={onClick}
      style={{ borderColor: getTileColor() }}
    >
      <div className="p-2 h-full flex flex-col justify-between text-xs">
        {/* Property Header */}
        <div className="text-center">
          {isSpecial ? (
            <div className="space-y-1">
              <div className="text-lg">{getSpecialIcon()}</div>
              <div className="font-bold text-foreground leading-tight">{property.name}</div>
              {property.rent[0] > 0 && (
                <div className="text-gold font-semibold">₹{property.rent[0]}</div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div 
                className="h-3 w-full rounded-sm mb-1"
                style={{ backgroundColor: getTileColor() }}
              />
              <div className="text-lg">{getStateEmoji()}</div>
              <div className="font-bold text-foreground leading-tight">{property.name}</div>
              {property.state && (
                <div className="text-muted-foreground text-xs">{property.state}</div>
              )}
              <div className="text-gold font-semibold">₹{property.price}</div>
            </div>
          )}
        </div>

        {/* Ownership and Houses */}
        <div className="space-y-1">
          {isOwned && !isSpecial && (
            <Badge variant="secondary" className="text-xs p-1">
              Owned
            </Badge>
          )}
          
          {property.houses > 0 && (
            <div className="flex justify-center gap-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-accent rounded-sm" />
              ))}
            </div>
          )}
          
          {property.hasHotel && (
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-destructive rounded-sm" />
            </div>
          )}
        </div>

        {/* Players on this tile - Enhanced visibility */}
        {players.length > 0 && (
          <div className="absolute -bottom-1 -right-1 flex flex-wrap gap-0.5 z-20">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-sm player-token shadow-lg"
                style={{ 
                  backgroundColor: player.color,
                  transform: `translate(${index * -10}px, ${index * -10}px)`,
                  zIndex: 20 + index
                }}
                title={`${player.name} - ₹${player.money.toLocaleString()}`}
              >
                <span className="filter drop-shadow-sm">
                  {player.token === 'rocket' ? '🚀' : 
                   player.token === 'elephant' ? '🐘' : 
                   player.token === 'train' ? '🚄' : 
                   player.token === 'rickshaw' ? '🛺' :
                   player.token === 'lotus' ? '🪷' : '🐅'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};