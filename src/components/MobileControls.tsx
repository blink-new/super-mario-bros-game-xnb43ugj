import React from 'react';
import { Controls } from '../types/game';
import { Button } from './ui/button';

interface MobileControlsProps {
  controls: Controls;
  setControls: (controls: Controls) => void;
  onPause: () => void;
  onRestart: () => void;
  onMenu: () => void;
  gameStatus: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  controls,
  setControls,
  onPause,
  onRestart,
  onMenu,
  gameStatus
}) => {
  const handleTouchStart = (controlType: keyof Controls) => {
    setControls({ ...controls, [controlType]: true });
  };

  const handleTouchEnd = (controlType: keyof Controls) => {
    setControls({ ...controls, [controlType]: false });
  };

  // Prevent context menu on long press
  const preventContextMenu = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4 z-50">
      {/* Action Buttons Row */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          onClick={onPause}
          className="font-retro text-xs px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {gameStatus === 'paused' ? 'RESUME' : 'PAUSE'}
        </Button>
        
        <Button
          onClick={onRestart}
          className="font-retro text-xs px-3 py-2 bg-red-600 hover:bg-red-700 text-white"
        >
          RESTART
        </Button>
        
        <Button
          onClick={onMenu}
          className="font-retro text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          MENU
        </Button>
      </div>

      {/* Game Controls */}
      <div className="flex justify-between items-end">
        {/* Left Side - Movement Controls */}
        <div className="flex flex-col items-center">
          {/* D-Pad Layout */}
          <div className="grid grid-cols-3 gap-1 mb-2">
            {/* Top row - empty, up, empty */}
            <div></div>
            <Button
              onTouchStart={() => handleTouchStart('jump')}
              onTouchEnd={() => handleTouchEnd('jump')}
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
              onContextMenu={preventContextMenu}
              className="w-12 h-12 font-retro text-lg bg-green-700 hover:bg-green-600 text-white border-2 border-green-500 active:bg-green-800 select-none"
            >
              ↑
            </Button>
            <div></div>
            
            {/* Middle row - left, center, right */}
            <Button
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              onContextMenu={preventContextMenu}
              className="w-12 h-12 font-retro text-lg bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 active:bg-gray-800 select-none"
            >
              ←
            </Button>
            <div className="w-12 h-12"></div>
            <Button
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              onContextMenu={preventContextMenu}
              className="w-12 h-12 font-retro text-lg bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 active:bg-gray-800 select-none"
            >
              →
            </Button>
            
            {/* Bottom row - empty, down, empty */}
            <div></div>
            <Button
              onTouchStart={() => handleTouchStart('crouch')}
              onTouchEnd={() => handleTouchEnd('crouch')}
              onMouseDown={() => handleTouchStart('crouch')}
              onMouseUp={() => handleTouchEnd('crouch')}
              onContextMenu={preventContextMenu}
              className="w-12 h-12 font-retro text-lg bg-orange-700 hover:bg-orange-600 text-white border-2 border-orange-500 active:bg-orange-800 select-none"
            >
              ↓
            </Button>
            <div></div>
          </div>
          
          <span className="text-xs text-gray-300 font-retro">MOVE</span>
        </div>

        {/* Right Side - Action Controls */}
        <div className="flex flex-col items-center">
          <div className="flex gap-3 mb-2">
            {/* Jump Button */}
            <Button
              onTouchStart={() => handleTouchStart('jump')}
              onTouchEnd={() => handleTouchEnd('jump')}
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
              onContextMenu={preventContextMenu}
              className="w-16 h-16 font-retro text-sm bg-red-700 hover:bg-red-600 text-white border-4 border-red-500 rounded-full active:bg-red-800 select-none"
            >
              JUMP
            </Button>
            
            {/* Run Button */}
            <Button
              onTouchStart={() => handleTouchStart('run')}
              onTouchEnd={() => handleTouchEnd('run')}
              onMouseDown={() => handleTouchStart('run')}
              onMouseUp={() => handleTouchEnd('run')}
              onContextMenu={preventContextMenu}
              className="w-16 h-16 font-retro text-sm bg-blue-700 hover:bg-blue-600 text-white border-4 border-blue-500 rounded-full active:bg-blue-800 select-none"
            >
              RUN
            </Button>
          </div>
          
          <span className="text-xs text-gray-300 font-retro">ACTIONS</span>
        </div>
      </div>

      {/* Controls Info */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-400 font-retro">
          TOUCH CONTROLS ACTIVE
        </p>
      </div>
    </div>
  );
};