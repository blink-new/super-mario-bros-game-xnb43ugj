import React from 'react';
import { Button } from './ui/button';

interface StartMenuProps {
  onStartGame: () => void;
  onShowControls: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStartGame, onShowControls }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4">
      {/* Game Title */}
      <div className="text-center mb-12">
        <h1 className="font-retro text-6xl text-white mb-4 drop-shadow-lg">
          SUPER MARIO BROS
        </h1>
        <h2 className="font-retro text-2xl text-yellow-300 drop-shadow-md">
          RECREATION
        </h2>
      </div>

      {/* Mario Sprite Placeholder */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-red-500 rounded-sm border-2 border-red-700 flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-4 text-center">
        <Button
          onClick={onStartGame}
          className="font-retro text-lg px-8 py-3 bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 shadow-lg"
        >
          START GAME
        </Button>
        
        <Button
          onClick={onShowControls}
          className="font-retro text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 shadow-lg"
        >
          CONTROLS
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <p className="font-retro text-sm text-white opacity-80">
          Press ENTER to start or click START GAME
        </p>
      </div>

      {/* Credits */}
      <div className="absolute bottom-4 text-center">
        <p className="font-retro text-xs text-white opacity-60">
          Recreation built with React & TypeScript
        </p>
      </div>
    </div>
  );
};