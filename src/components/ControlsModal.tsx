import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-retro text-xl text-center">GAME CONTROLS</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Movement Controls */}
          <div>
            <h3 className="font-retro text-lg mb-3 text-blue-600">MOVEMENT</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-retro">Move Left:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">← or A</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Move Right:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">→ or D</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Jump:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">↑ or W or SPACE</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Crouch:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">↓ or S</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Run:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">SHIFT</span>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div>
            <h3 className="font-retro text-lg mb-3 text-green-600">GAME CONTROLS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-retro">Start Game:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">ENTER</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Pause/Resume:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">P</span>
              </div>
              <div className="flex justify-between">
                <span className="font-retro">Restart:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">R</span>
              </div>
            </div>
          </div>

          {/* Gameplay Tips */}
          <div>
            <h3 className="font-retro text-lg mb-3 text-red-600">GAMEPLAY TIPS</h3>
            <div className="space-y-2 text-sm">
              <p className="font-retro">• Jump on enemies to defeat them</p>
              <p className="font-retro">• Hit question blocks for coins and power-ups</p>
              <p className="font-retro">• Collect mushrooms to grow bigger</p>
              <p className="font-retro">• Fire flowers give you fire power</p>
              <p className="font-retro">• Avoid touching enemies from the side</p>
              <p className="font-retro">• Break brick blocks when you're Super Mario</p>
            </div>
          </div>

          {/* Mobile Controls Note */}
          <div className="md:hidden">
            <h3 className="font-retro text-lg mb-3 text-purple-600">MOBILE CONTROLS</h3>
            <p className="text-sm font-retro">
              Touch controls will appear at the bottom of the game screen when playing.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};