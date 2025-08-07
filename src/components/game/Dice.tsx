import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DiceProps {
  dice: [number, number];
  onRoll: () => void;
  canRoll: boolean;
}

export const Dice: React.FC<DiceProps> = ({ dice, onRoll, canRoll }) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (!canRoll || isRolling) return;
    
    setIsRolling(true);
    onRoll();
    
    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  };

  const renderDiceFace = (value: number) => {
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
    };

    const positions = dotPositions[value as keyof typeof dotPositions] || [];
    
    return (
      <div className="dice-3d relative">
        {positions.map((position, index) => (
          <div
            key={index}
            className={`dice-dot ${position}`}
            style={{
              top: position.includes('top') ? '8px' : position.includes('bottom') ? '44px' : '26px',
              left: position.includes('left') ? '8px' : position.includes('right') ? '44px' : '26px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Red 3D Dice with White Dots */}
      <div className="flex gap-4 perspective-1000">
        {dice.map((value, index) => (
          <div 
            key={index}
            className={`dice-3d ${isRolling ? 'animate-spin' : ''} transition-all duration-500 hover:scale-110`}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: isRolling 
                ? '0 0 40px rgba(220, 38, 38, 0.8)' 
                : '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {renderDiceFace(value)}
          </div>
        ))}
      </div>
      
      {/* Enhanced Total Display */}
      <div className="text-center space-y-3">
        <div className="bg-gradient-to-r from-saffron to-green bg-clip-text">
          <div className="text-4xl font-baloo font-bold text-transparent mb-1">
            Total: {dice[0] + dice[1]}
          </div>
          <div className="text-sm text-muted-foreground">
            {dice[0]} + {dice[1]}
          </div>
        </div>
        
        {/* Enhanced Roll Button */}
        <Button 
          onClick={handleRoll}
          disabled={!canRoll || isRolling}
          variant="default"
          className={`font-baloo font-bold text-xl py-6 px-12 transition-all duration-300 
            ${isRolling ? 'animate-pulse bg-destructive' : 'hover:scale-105'}
            bg-gradient-to-r from-saffron to-green hover:from-green hover:to-saffron text-white`}
          size="lg"
        >
          {isRolling ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin text-2xl">🎲</div>
              <span>Rolling...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎲</span>
              <span>Roll Dice</span>
            </div>
          )}
        </Button>
      </div>

      {/* Dice Roll Sound Effect Indicator */}
      {isRolling && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          🔊 Rolling with sound effects...
        </div>
      )}
    </div>
  );
};