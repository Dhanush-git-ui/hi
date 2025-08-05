import { Property, SurpriseCard, TreasureCard } from '@/types/game';

export const BOARD_PROPERTIES: Property[] = [
  // Start corner
  { id: 0, name: 'START', state: '', type: 'special', tier: 1, price: 0, rent: [2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  
  // Side 1 (Bottom)
  { id: 1, name: 'Maharashtra', state: 'Mumbai', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 2, name: 'Surprise', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  { id: 3, name: 'Tamil Nadu', state: 'Chennai', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 4, name: 'Income Tax', state: '', type: 'special', tier: 1, price: 0, rent: [200], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--special-tile))' },
  { id: 5, name: 'Delhi Airport', state: 'Delhi', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  
  // Corner 2 - Jail
  { id: 6, name: 'JAIL', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--destructive))' },
  
  // Side 2 (Left)
  { id: 7, name: 'Gujarat', state: 'Ahmedabad', type: 'property', tier: 1, price: 5500, rent: [550, 1100, 3300, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 8, name: 'Electric Board', state: '', type: 'utility', tier: 1, price: 1500, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-orange))' },
  { id: 9, name: 'Karnataka', state: 'Bangalore', type: 'property', tier: 1, price: 5500, rent: [550, 1100, 3300, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 10, name: 'Uttar Pradesh', state: 'Lucknow', type: 'property', tier: 1, price: 6000, rent: [600, 1200, 3600, 8000, 9750], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier1))' },
  { id: 11, name: 'Mumbai Airport', state: 'Mumbai', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  
  // Corner 3 - Vacation
  { id: 12, name: 'VACATION', state: '', type: 'special', tier: 1, price: 0, rent: [500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--accent))' },
  
  // Side 3 (Top)
  { id: 13, name: 'Telangana', state: 'Hyderabad', type: 'property', tier: 2, price: 5000, rent: [500, 1000, 3000, 7500, 9250], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 14, name: 'Kerala', state: 'Kochi', type: 'property', tier: 2, price: 5000, rent: [500, 1000, 3000, 7500, 9250], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 15, name: 'Treasure', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  { id: 16, name: 'West Bengal', state: 'Kolkata', type: 'property', tier: 2, price: 5200, rent: [520, 1040, 3120, 7800, 9500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 17, name: 'Kolkata Airport', state: 'Kolkata', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
  
  // Corner 4 - Go to Jail
  { id: 18, name: 'GO TO JAIL', state: '', type: 'special', tier: 1, price: 0, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--destructive))' },
  
  // Side 4 (Right)
  { id: 19, name: 'Punjab', state: 'Chandigarh', type: 'property', tier: 2, price: 4800, rent: [480, 960, 2880, 7200, 8800], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier2))' },
  { id: 20, name: 'Rajasthan', state: 'Jaipur', type: 'property', tier: 3, price: 4000, rent: [400, 800, 2400, 6000, 7500], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier3))' },
  { id: 21, name: 'Water Board', state: '', type: 'utility', tier: 1, price: 1500, rent: [0], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-orange))' },
  { id: 22, name: 'Andhra Pradesh', state: 'Amaravati', type: 'property', tier: 3, price: 4200, rent: [420, 840, 2520, 6300, 7700], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--property-tier3))' },
  { id: 23, name: 'Chennai Airport', state: 'Chennai', type: 'airport', tier: 1, price: 2000, rent: [250, 500, 1000, 2000], owner: undefined, houses: 0, hasHotel: false, mortgaged: false, color: 'hsl(var(--neon-gold))' },
];

export const SURPRISE_CARDS: SurpriseCard[] = [
  { id: '1', title: 'Bollywood Investment', description: 'Your movie became a blockbuster!', effect: 'receive', amount: 3000, emoji: '🎬' },
  { id: '2', title: 'Corruption Charge', description: 'You have been fined for corruption', effect: 'pay', amount: 1500, emoji: '💸' },
  { id: '3', title: 'Temple Donation', description: 'Make a temple donation (tax-deductible)', effect: 'pay', amount: 500, emoji: '🛕' },
  { id: '4', title: 'Festival Bonus', description: 'Happy Diwali! Enjoy the festival bonus', effect: 'receive', amount: 2000, emoji: '🪔' },
  { id: '5', title: 'Bullet Train Delay', description: 'Train delayed, miss your turn', effect: 'skip_turn', emoji: '🚉' },
  { id: '6', title: 'Startup Success', description: 'Your startup got funded!', effect: 'receive', amount: 5000, emoji: '💻' },
  { id: '7', title: 'Election Speech', description: 'Move to any tile of your choice', effect: 'move_anywhere', emoji: '🎤' },
  { id: '8', title: 'Hack Opponent', description: 'Swap a random property with rival', effect: 'swap_property', emoji: '🎯' },
];

export const TREASURE_CARDS: TreasureCard[] = [
  { id: '1', title: 'Gold Discovery', description: 'You found ancient gold!', effect: 'receive', amount: 2500, emoji: '🏆' },
  { id: '2', title: 'Heritage Site', description: 'UNESCO recognition bonus', effect: 'receive', amount: 1800, emoji: '🏛️' },
  { id: '3', title: 'Monsoon Blessing', description: 'Good harvest this season', effect: 'receive', amount: 1200, emoji: '🌧️' },
  { id: '4', title: 'Tech Patent', description: 'Your innovation got patented', effect: 'receive', amount: 3500, emoji: '⚡' },
  { id: '5', title: 'Tourism Boom', description: 'Foreign tourists love your state', effect: 'receive', amount: 2000, emoji: '📸' },
  { id: '6', title: 'Spice Trade', description: 'Spice exports are profitable', effect: 'receive', amount: 1500, emoji: '🌶️' },
];

export const PLAYER_TOKENS = [
  { id: 'rocket', name: 'Rocket', emoji: '🚀', color: 'hsl(0 85% 60%)' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', color: 'hsl(220 85% 55%)' },
  { id: 'train', name: 'Bullet Train', emoji: '🚄', color: 'hsl(120 85% 55%)' },
  { id: 'rickshaw', name: 'Auto Rickshaw', emoji: '🛺', color: 'hsl(45 100% 50%)' },
  { id: 'lotus', name: 'Lotus', emoji: '🪷', color: 'hsl(280 85% 55%)' },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', color: 'hsl(15 100% 55%)' },
];