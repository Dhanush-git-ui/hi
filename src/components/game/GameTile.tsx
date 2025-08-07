import React from 'react';
import { Property, Player } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GameTileProps {
  property: Property;
  onClick: () => void;
  players: Player[];
  isActive?: boolean;
  regionColor?: string;
  glowColor?: string;
  isCorner?: boolean;
  isHorizontal?: boolean;
  isVertical?: boolean;
}

export const GameTile: React.FC<GameTileProps> = ({
  property,
  onClick,
  players,
  isActive = false,
  regionColor = 'border-gray-500',
  glowColor = 'hover:shadow-gray-500/50',
  isCorner = false,
  isHorizontal = false,
  isVertical = false
}) => {
  const isCorner = [0, 6, 12, 18].includes(property.id);
  const isSpecial = property.type === 'special';
  const isOwned = property.owner !== undefined;
  const isUtility = property.type === 'utility';
  const isAirport = property.type === 'airport';

  const getTileColor = () => {
    if (isSpecial) return 'hsl(var(--special-tile))';
    if (isAirport) return 'hsl(var(--neon-gold))';
    if (isUtility) return 'hsl(var(--neon-orange))';
    if (isOwned) return 'hsl(var(--destructive))'; // Red for owned
    return property.color; // Green for buyable
  };

  const getTileBackground = () => {
    if (isOwned) return 'bg-destructive/20';
    if (isSpecial) return 'bg-accent/20';
    if (isUtility) return 'bg-orange-500/20';
    if (isAirport) return 'bg-yellow-500/20';
    return 'bg-green-500/20'; // Green for buyable
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

  const getTooltipContent = () => {
    let content = `${property.name}`;
    if (property.state) content += `\n🏛️ State: ${property.state}`;
    if (property.price > 0) content += `\n💰 Price: ₹${property.price.toLocaleString()}`;
    if (property.rent[0] > 0) content += `\n💸 Rent: ₹${property.rent[0]}`;
    if (isOwned) content += `\n🔒 Status: Owned`;
    else if (property.type === 'property') content += `\n✅ Status: Available to buy`;
    return content;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={`h-full w-full cursor-pointer tile-glow transition-all duration-300 ${
            isCorner ? 'aspect-square' : 'aspect-[3/4]'
          } relative overflow-hidden border-4 ${regionColor} ${glowColor} ${getTileBackground()} hover:bg-card/80 ${
            isActive ? 'ring-4 ring-neon-red ring-opacity-70 animate-pulse' : ''
          }`}
          onClick={onClick}
          style={{ 
            borderColor: getTileColor(),
            boxShadow: isActive ? '0 0 20px hsl(var(--neon-red) / 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="p-2 h-full flex flex-col justify-between text-xs">
            {/* Property Header */}
            <div className="text-center">
              {isSpecial ? (
                <div className="space-y-1">
                  <div className="text-lg animate-bounce">{getSpecialIcon()}</div>
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
                  <div className="font-bold text-foreground leading-tight text-sm">{property.name}</div>
                  {property.state && (
                    <div className="text-accent font-semibold text-xs bg-accent/10 px-1 rounded">
                      {property.state}
                    </div>
                  )}
                  <div className="text-gold font-semibold">₹{property.price}</div>
                </div>
              )}
            </div>

            {/* Ownership and Houses */}
            <div className="space-y-1">
              {isOwned && !isSpecial && (
                <Badge variant="destructive" className="text-xs p-1 animate-pulse">
                  🔒 Owned
                </Badge>
              )}
              
              {!isOwned && property.type === 'property' && (
                <Badge variant="secondary" className="text-xs p-1 bg-green-600">
                  💰 Buyable
                </Badge>
              )}
              
              {property.houses > 0 && (
                <div className="flex justify-center gap-1">
                  {Array.from({ length: property.houses }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-accent rounded-sm animate-pulse" />
                  ))}
                </div>
              )}
              
              {property.hasHotel && (
                <div className="flex justify-center">
                  <div className="w-3 h-3 bg-destructive rounded-sm animate-bounce" />
                </div>
              )}
            </div>

            {/* Players on this tile - Enhanced visibility */}
            {players.length > 0 && (
              <div className="absolute -bottom-1 -right-1 flex flex-wrap gap-0.5 z-20">
                {players.map((player, index) => (
                  <div 
                    key={player.id}
                    className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-sm player-token shadow-lg animate-bounce"
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

            {/* Active tile indicator */}
            {isActive && (
              <div className="absolute inset-0 border-2 border-neon-red border-opacity-50 rounded-lg animate-pulse" />
            )}
          </div>
        </Card>
      </TooltipTrigger>
      <TooltipContent className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <div className="text-sm whitespace-pre-line">
          {getTooltipContent()}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};