import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Smile } from 'lucide-react';

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'event' | 'system';
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentPlayer: string;
}

const EMOJI_LIST = ['😀', '😍', '🎉', '💰', '🏠', '🚀', '🐘', '🚄', '🛺', '🪷', '🐅', '🏛️', '🎯', '💎', '🪔', '🎬', '💻', '🌶️', '🥥', '🌾'];

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, currentPlayer }) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-green-500/20 text-green-500';
      case 'system': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-card/50 text-foreground';
    }
  };

  return (
    <Card className="bg-glass p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neon flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat & Events
        </h3>
        <Badge variant="secondary" className="text-xs">
          {messages.length} messages
        </Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-2 rounded-lg ${getMessageTypeColor(msg.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {msg.type === 'chat' && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.player}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">{msg.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="mb-3 p-3 bg-card/50 rounded-lg">
          <div className="grid grid-cols-10 gap-1">
            {EMOJI_LIST.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 text-lg hover:bg-accent/20 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEmojis(!showEmojis)}
          className="px-2"
        >
          <Smile className="w-4 h-4" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} size="sm" className="px-3">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
