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
  // Arrange tiles in board layout: 6 tiles per side
  const bottomTiles = properties.slice(0, 6);
  const leftTiles = properties.slice(6, 12);
  const topTiles = properties.slice(12, 18).reverse();
  const rightTiles = properties.slice(18, 24).reverse();

  return (
    <div className="relative w-full h-full min-h-[600px] game-board rounded-2xl p-4">
      <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full">
        {/* Top-left corner */}
        <div className="col-span-1 row-span-1">
          <GameTile 
            property={properties[12]} 
            onClick={() => onTileClick(12)}
            players={players.filter(p => p.position === 12)}
          />
        </div>
        
        {/* Top side */}
        {topTiles.slice(1, 6).map((property, index) => (
          <div key={property.id} className="col-span-1 row-span-1">
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}
        
        {/* Top-right corner */}
        <div className="col-span-1 row-span-1">
          <GameTile 
            property={properties[18]} 
            onClick={() => onTileClick(18)}
            players={players.filter(p => p.position === 18)}
          />
        </div>

        {/* Right side */}
        {rightTiles.map((property, index) => (
          <div key={property.id} className={`col-span-1 row-span-1 ${index === 0 ? 'col-start-8 row-start-2' : ''}`}>
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}

        {/* Center area with dice and game info */}
        <div className="col-span-6 row-span-6 col-start-2 row-start-2 flex flex-col items-center justify-center bg-glass rounded-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-neon mb-2">BHARAT BUSINESS</h1>
            <p className="text-lg text-gold">Indian States Monopoly</p>
          </div>
          
          <div className="mb-6">
            <Dice dice={dice} onRoll={onRollDice} canRoll={canRollDice} />
          </div>

          <div className="bg-card/50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Current Player</h3>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{currentPlayer.token === 'rocket' ? '🚀' : 
                                         currentPlayer.token === 'elephant' ? '🐘' : 
                                         currentPlayer.token === 'train' ? '🚄' : 
                                         currentPlayer.token === 'rickshaw' ? '🛺' :
                                         currentPlayer.token === 'lotus' ? '🪷' : '🐅'}</span>
              <span className="text-lg font-medium" style={{ color: currentPlayer.color }}>
                {currentPlayer.name}
              </span>
            </div>
            <p className="text-gold font-semibold mt-1">₹{currentPlayer.money.toLocaleString()}</p>
          </div>
        </div>

        {/* Bottom-right corner */}
        <div className="col-span-1 row-span-1 col-start-8 row-start-8">
          <GameTile 
            property={properties[0]} 
            onClick={() => onTileClick(0)}
            players={players.filter(p => p.position === 0)}
          />
        </div>

        {/* Bottom side */}
        {bottomTiles.slice(1, 6).reverse().map((property, index) => (
          <div key={property.id} className="col-span-1 row-span-1 row-start-8">
            <GameTile 
              property={property} 
              onClick={() => onTileClick(property.id)}
              players={players.filter(p => p.position === property.id)}
            />
          </div>
        ))}

        {/* Bottom-left corner */}
        <div className="col-span-1 row-span-1 col-start-1 row-start-8">
          <GameTile 
            property={properties[6]} 
            onClick={() => onTileClick(6)}
            players={players.filter(p => p.position === 6)}
          />
        </div>

        {/* Left side */}
        {leftTiles.slice(1, 6).map((property, index) => (
          <div key={property.id} className={`col-span-1 row-span-1 col-start-1 ${index === 0 ? 'row-start-7' : `row-start-${7 - index}`}`}>
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