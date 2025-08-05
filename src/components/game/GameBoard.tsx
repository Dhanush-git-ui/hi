import React from 'react';
import { Property, Player } from '@/types/game';
import { GameTile } from './GameTile';
import { PlayerToken } from './PlayerToken';
import { Dice } from './Dice';

interface GameBoardProps {
  properties: Property[];
  players: Player[];
  currentPlayer: Player;
  dice: [number, number];
  onTileClick: (tileId: number) => void;
  onRollDice: () => void;
  canRollDice: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  properties,
  players,
  currentPlayer,
  dice,
  onTileClick,
  onRollDice,
  canRollDice
}) => {
  // Arrange tiles to match the monopoly board structure
  // Bottom row (0-5): START, Maharashtra, Surprise, Tamil Nadu, Income Tax, Delhi Airport
  const bottomTiles = properties.slice(0, 6);
  
  // Left side (6-11): JAIL, Gujarat, Electric Board, Karnataka, Uttar Pradesh, Mumbai Airport  
  const leftTiles = properties.slice(6, 12);
  
  // Top row (12-17): VACATION, Telangana, Kerala, Treasure, West Bengal, Kolkata Airport
  const topTiles = properties.slice(12, 18).reverse();
  
  // Right side (18-23): GO TO JAIL, Punjab, Rajasthan, Water Board, Andhra Pradesh, Chennai Airport
  const rightTiles = properties.slice(18, 24).reverse();

  return (
    <div className="relative w-full h-full min-h-[800px] game-board rounded-2xl p-2">
      <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full">
        {/* Top-left corner - VACATION (12) */}
        <div className="col-span-1 row-span-1">
          <GameTile 
            property={properties[12]} 
            onClick={() => onTileClick(12)}
            players={players.filter(p => p.position === 12)}
          />
        </div>
        
        {/* Top side - positions 13-17 */}
        {topTiles.slice(1).map((property, index) => (
          <div key={property.id} className="col-span-1 row-span-1">
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}
        
        {/* Top-right corner - GO TO JAIL (18) */}
        <div className="col-span-1 row-span-1">
          <GameTile 
            property={properties[18]} 
            onClick={() => onTileClick(18)}
            players={players.filter(p => p.position === 18)}
          />
        </div>

        {/* Right side - positions 19-23 */}
        {rightTiles.map((property, index) => (
          <div key={property.id} className={`col-span-1 row-span-1 col-start-8 row-start-${index + 2}`}>
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}

        {/* Center area with dice and game info */}
        <div className="col-span-6 row-span-6 col-start-2 row-start-2 flex flex-col items-center justify-center bg-glass rounded-xl p-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-neon mb-2">BHARAT BUSINESS</h1>
            <p className="text-lg text-gold">Indian States Monopoly</p>
          </div>
          
          <div className="mb-4">
            <Dice dice={dice} onRoll={onRollDice} canRoll={canRollDice} />
          </div>

          {currentPlayer && (
            <div className="bg-card/50 rounded-lg p-3 text-center">
              <h3 className="text-base font-semibold mb-2 text-foreground">Current Player</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <PlayerToken player={currentPlayer} size="md" />
                <span className="text-lg font-medium" style={{ color: currentPlayer.color }}>
                  {currentPlayer.name}
                </span>
              </div>
              <p className="text-gold font-semibold">₹{currentPlayer.money.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Bottom-right corner - START (0) */}
        <div className="col-span-1 row-span-1 col-start-8 row-start-8">
          <GameTile 
            property={properties[0]} 
            onClick={() => onTileClick(0)}
            players={players.filter(p => p.position === 0)}
          />
        </div>

        {/* Bottom side - positions 1-5 reversed */}
        {bottomTiles.slice(1).reverse().map((property, index) => (
          <div key={property.id} className={`col-span-1 row-span-1 col-start-${7 - index} row-start-8`}>
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}

        {/* Bottom-left corner - JAIL (6) */}
        <div className="col-span-1 row-span-1 col-start-1 row-start-8">
          <GameTile 
            property={properties[6]} 
            onClick={() => onTileClick(6)}
            players={players.filter(p => p.position === 6)}
          />
        </div>

        {/* Left side - positions 7-11 */}
        {leftTiles.slice(1).map((property, index) => (
          <div key={property.id} className={`col-span-1 row-span-1 col-start-1 row-start-${7 - index}`}>
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};