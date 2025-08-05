import React from 'react';
import { Player } from '@/types/game';

interface PlayerTokenProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ player, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-12 h-12 text-xl'
  };

  const getTokenEmoji = () => {
    switch (player.token) {
      case 'rocket': return '🚀';
      case 'elephant': return '🐘';
      case 'train': return '🚄';
      case 'rickshaw': return '🛺';
      case 'lotus': return '🪷';
      case 'tiger': return '🐅';
      default: return '🎮';
    }
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full border-2 border-background flex items-center justify-center player-token shadow-lg`}
      style={{ backgroundColor: player.color }}
      title={`${player.name} - ₹${player.money.toLocaleString()}`}
    >
      <span className="filter drop-shadow-sm">
        {getTokenEmoji()}
      </span>
    </div>
  );
};