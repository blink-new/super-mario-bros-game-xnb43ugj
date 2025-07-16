import React from 'react';
import { Button } from './ui/button';

interface GameOverScreenProps {
  score: number;
  coins: number;
  world: string;
  level: number;
  isVictory: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  coins,
  world,
  level,
  isVictory,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Game Over/Victory Title */}
        <div className="space-y-4">
          <h1 className={`font-retro text-4xl md:text-5xl drop-shadow-lg ${
            isVictory ? 'text-yellow-400' : 'text-red-500'
          }`}>
            {isVictory ? 'VICTORY!' : 'GAME OVER'}
          </h1>
          
          {isVictory ? (
            <p className="font-retro text-lg text-green-400">
              LEVEL COMPLETE!
            </p>
          ) : (
            <p className="font-retro text-lg text-gray-400">
              BETTER LUCK NEXT TIME
            </p>
          )}
        </div>

        {/* Mario representation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`w-16 h-16 rounded-sm relative ${
              isVictory ? 'bg-yellow-400' : 'bg-gray-600'
            }`}>
              {/* Hat */}
              <div className={`absolute top-0 left-0 w-full h-4 rounded-t-sm ${
                isVictory ? 'bg-yellow-600' : 'bg-gray-800'
              }`}></div>
              {/* Face */}
              <div className="absolute top-4 left-2 w-12 h-8 bg-yellow-200 rounded-sm"></div>
              {/* Eyes */}
              <div className="absolute top-5 left-4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-5 left-8 w-1 h-1 bg-black rounded-full"></div>
              {/* Expression */}
              {isVictory ? (
                <div className="absolute top-8 left-5 w-2 h-1 bg-black rounded-sm"></div>
              ) : (
                <div className="absolute top-8 left-5 w-2 h-1 bg-black rounded-sm transform rotate-180"></div>
              )}
            </div>
          </div>
        </div>

        {/* Final Stats */}
        <div className="space-y-4 bg-blue-900 p-6 rounded-lg border-2 border-blue-700">
          <h2 className="font-retro text-lg text-yellow-400">FINAL STATS</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-retro">SCORE:</span>
              <span className="font-retro text-yellow-300">{score.toString().padStart(6, '0')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-retro">COINS:</span>
              <span className="font-retro text-yellow-300">{coins.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-retro">WORLD:</span>
              <span className="font-retro text-yellow-300">{world}-{level}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onRestart}
            className="w-full font-retro text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            PLAY AGAIN
          </Button>
          
          <Button
            onClick={onMainMenu}
            className="w-full font-retro text-sm px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            MAIN MENU
          </Button>
        </div>

        {/* High Score Message */}
        {isVictory && (
          <div className="text-center">
            <p className="font-retro text-xs text-green-400 animate-pulse">
              CONGRATULATIONS!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};