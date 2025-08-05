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
    }, 600);
  };

  const getDiceFace = (value: number) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1] || '⚀';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {dice.map((value, index) => (
          <Card 
            key={index}
            className={`w-16 h-16 flex items-center justify-center bg-card neon-border text-4xl ${
              isRolling ? 'dice-animation' : ''
            }`}
          >
            {getDiceFace(value)}
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-gold mb-2">
          Total: {dice[0] + dice[1]}
        </div>
        
        <Button 
          onClick={handleRoll}
          disabled={!canRoll || isRolling}
          variant="default"
          className="neon-glow font-semibold"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Button>
      </div>
    </div>
  );
};