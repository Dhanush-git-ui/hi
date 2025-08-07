import React, { useState } from 'react';
import { GameTile } from './GameTile';
import { Dice } from './Dice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';

interface GameBoardProps {
  properties: any[];
  players: any[];
  currentPlayer: any;
  dice: [number, number];
  onRoll: () => void;
  canRollDice: boolean;
  onTileClick: (id: number) => void;
  onBuyProperty?: () => void;
  canBuyProperty?: boolean;
  selectedProperty?: any;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  properties,
  players,
  currentPlayer,
  dice,
  onRoll,
  canRollDice,
  onTileClick,
  onBuyProperty,
  canBuyProperty = false,
  selectedProperty
}) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (!canRollDice || isRolling) return;
    setIsRolling(true);
    onRoll();
    setTimeout(() => setIsRolling(false), 1000);
  };

  const getCurrentLocation = () => {
    const currentTile = properties.find(p => p.id === currentPlayer.position);
    return currentTile ? currentTile.name : 'Unknown';
  };

  // Indian region-based color mapping
  const getRegionColor = (stateName: string) => {
    const regions = {
      // Desert/West set - Saffron
      'Rajasthan': 'saffron', 'Gujarat': 'saffron', 'Maharashtra': 'saffron',
      // South set - Green  
      'Kerala': 'green', 'Tamil Nadu': 'green', 'Andhra Pradesh': 'green',
      // Northeast set - Purple/Maroon
      'Assam': 'maroon', 'Sikkim': 'maroon', 'Meghalaya': 'maroon',
      // Central set - Peacock Blue
      'Madhya Pradesh': 'peacock', 'Chhattisgarh': 'peacock', 'Jharkhand': 'peacock',
      // North set - Gold
      'Punjab': 'gold', 'Haryana': 'gold', 'Uttar Pradesh': 'gold'
    };
    return regions[stateName as keyof typeof regions] || 'saffron';
  };

  const getRegionBorderColor = (region: string) => {
    const colors = {
      saffron: 'border-saffron',
      green: 'border-green', 
      maroon: 'border-maroon',
      peacock: 'border-peacock',
      gold: 'border-gold'
    };
    return colors[region as keyof typeof colors] || 'border-saffron';
  };

  const getRegionGlowColor = (region: string) => {
    const glows = {
      saffron: 'hover:shadow-saffron',
      green: 'hover:shadow-green',
      maroon: 'hover:shadow-maroon', 
      peacock: 'hover:shadow-peacock',
      gold: 'hover:shadow-gold'
    };
    return glows[region as keyof typeof glows] || 'hover:shadow-saffron';
  };

  // Get tiles for each side
  const topTiles = properties.slice(0, 6); // Start + 5 states
  const rightTiles = properties.slice(6, 11); // 5 states
  const bottomTiles = properties.slice(11, 17); // Free Parking + 5 states
  const leftTiles = properties.slice(17, 22); // 5 states

  return (
    <TooltipProvider>
      <div className="board-square-container">
        {/* Top Row - Start + 5 states + Jail */}
        <div className="top-row">
          {/* Start Corner */}
          <div className="corner-tile">
            <GameTile
              property={properties[0]}
              onClick={() => onTileClick(properties[0].id)}
              players={players.filter(p => p.position === properties[0].id)}
              isActive={currentPlayer.position === properties[0].id}
              regionColor="border-gold"
              glowColor="hover:shadow-gold"
              isCorner={true}
            />
          </div>
          
          {/* 5 Horizontal Property Tiles */}
          {topTiles.slice(1, 6).map((property) => (
            <div key={property.id} className="horizontal-tile">
              <GameTile
                property={property}
                onClick={() => onTileClick(property.id)}
                players={players.filter(p => p.position === property.id)}
                isActive={currentPlayer.position === property.id}
                regionColor={getRegionBorderColor(getRegionColor(property.name))}
                glowColor={getRegionGlowColor(getRegionColor(property.name))}
                isHorizontal={true}
              />
            </div>
          ))}
          
          {/* Jail Corner */}
          <div className="corner-tile">
            <GameTile
              property={properties[6]}
              onClick={() => onTileClick(properties[6].id)}
              players={players.filter(p => p.position === properties[6].id)}
              isActive={currentPlayer.position === properties[6].id}
              regionColor="border-maroon"
              glowColor="hover:shadow-maroon"
              isCorner={true}
            />
          </div>
        </div>

        {/* Right Column - 5 vertical states */}
        <div className="right-column">
          {rightTiles.map((property) => (
            <div key={property.id} className="vertical-tile">
              <GameTile
                property={property}
                onClick={() => onTileClick(property.id)}
                players={players.filter(p => p.position === property.id)}
                isActive={currentPlayer.position === property.id}
                regionColor={getRegionBorderColor(getRegionColor(property.name))}
                glowColor={getRegionGlowColor(getRegionColor(property.name))}
                isVertical={true}
              />
            </div>
          ))}
        </div>

        {/* Bottom Row - Free Parking + 5 states + Go to Jail */}
        <div className="bottom-row">
          {/* Go to Jail Corner */}
          <div className="corner-tile">
            <GameTile
              property={properties[11]}
              onClick={() => onTileClick(properties[11].id)}
              players={players.filter(p => p.position === properties[11].id)}
              isActive={currentPlayer.position === properties[11].id}
              regionColor="border-maroon"
              glowColor="hover:shadow-maroon"
              isCorner={true}
            />
          </div>
          
          {/* 5 Horizontal Property Tiles (reversed) */}
          {bottomTiles.slice(1, 6).reverse().map((property) => (
            <div key={property.id} className="horizontal-tile">
              <GameTile
                property={property}
                onClick={() => onTileClick(property.id)}
                players={players.filter(p => p.position === property.id)}
                isActive={currentPlayer.position === property.id}
                regionColor={getRegionBorderColor(getRegionColor(property.name))}
                glowColor={getRegionGlowColor(getRegionColor(property.name))}
                isHorizontal={true}
              />
            </div>
          ))}
          
          {/* Free Parking Corner */}
          <div className="corner-tile">
            <GameTile
              property={properties[17]}
              onClick={() => onTileClick(properties[17].id)}
              players={players.filter(p => p.position === properties[17].id)}
              isActive={currentPlayer.position === properties[17].id}
              regionColor="border-gold"
              glowColor="hover:shadow-gold"
              isCorner={true}
            />
          </div>
        </div>

        {/* Left Column - 5 vertical states */}
        <div className="left-column">
          {leftTiles.reverse().map((property) => (
            <div key={property.id} className="vertical-tile">
              <GameTile
                property={property}
                onClick={() => onTileClick(property.id)}
                players={players.filter(p => p.position === property.id)}
                isActive={currentPlayer.position === property.id}
                regionColor={getRegionBorderColor(getRegionColor(property.name))}
                glowColor={getRegionGlowColor(getRegionColor(property.name))}
                isVertical={true}
              />
            </div>
          ))}
        </div>

        {/* Center Game Area - 5×5 grid space */}
        <div className="center-game-area">
          {/* Game Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-baloo font-bold bg-gradient-to-r from-saffron via-green to-peacock-blue bg-clip-text text-transparent mb-2">
              🇮🇳 BHARAT BUSINESS
            </h1>
            <p className="text-sm text-muted-foreground">
              ₹BharatCoins • Indian States Edition
            </p>
          </div>

          {/* Enhanced Dice Section */}
          <div className="mb-6">
            <Dice dice={dice} onRoll={handleRoll} canRoll={canRollDice} />
          </div>

          {/* Current Player Info */}
          <Card className="w-full p-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-saffron to-green flex items-center justify-center text-white font-bold">
                  {currentPlayer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-baloo font-semibold text-foreground">{currentPlayer.name}</p>
                  <p className="text-sm text-muted-foreground">₹{currentPlayer.money.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Current Location */}
              <div className="bg-accent/20 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="font-baloo font-semibold text-foreground">
                  🏛️ {getCurrentLocation()}
                </p>
              </div>

              {/* Jail Status */}
              {currentPlayer.inJail && (
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <span className="text-2xl">🔒</span>
                  <span className="font-semibold">In Jail</span>
                </div>
              )}
            </div>
          </Card>

          {/* Buy Property Button */}
          {selectedProperty && canBuyProperty && (
            <Card className="w-full p-4 mt-4 bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-center space-y-3">
                <div>
                  <p className="font-baloo font-bold text-foreground">{selectedProperty.name}</p>
                  <p className="text-bharat-gold font-semibold">₹{selectedProperty.price.toLocaleString()}</p>
                </div>
                <Button 
                  onClick={onBuyProperty}
                  className="w-full bg-gradient-to-r from-saffron to-green hover:from-green hover:to-saffron text-white font-baloo font-bold"
                >
                  🏠 Buy Property
                </Button>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="font-baloo bg-card/50 border-border/50"
            >
              🎫 Policy Card
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="font-baloo bg-card/50 border-border/50"
            >
              🎉 Festival Bonus
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};