import { useEffect, useCallback } from 'react';
import { Controls } from '../types/game';

interface UseKeyboardControlsProps {
  controls: Controls;
  setControls: (controls: Controls) => void;
  onStartGame: () => void;
  onPauseGame: () => void;
  onRestartGame: () => void;
  gameStatus: string;
}

export const useKeyboardControls = ({
  controls,
  setControls,
  onStartGame,
  onPauseGame,
  onRestartGame,
  gameStatus,
}: UseKeyboardControlsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Prevent default for game keys
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(key)) {
      event.preventDefault();
    }

    // Game control keys
    switch (key) {
      case 'enter':
        if (gameStatus === 'menu') {
          onStartGame();
        }
        break;
      case 'p':
        if (gameStatus === 'playing' || gameStatus === 'paused') {
          onPauseGame();
        }
        break;
      case 'r':
        onRestartGame();
        break;
    }

    // Movement controls
    const newControls = { ...controls };
    
    switch (key) {
      case 'arrowleft':
      case 'a':
        newControls.left = true;
        break;
      case 'arrowright':
      case 'd':
        newControls.right = true;
        break;
      case 'arrowup':
      case 'w':
      case ' ':
        newControls.jump = true;
        break;
      case 'arrowdown':
      case 's':
        newControls.crouch = true;
        break;
      case 'shift':
        newControls.run = true;
        break;
    }
    
    setControls(newControls);
  }, [controls, setControls, onStartGame, onPauseGame, onRestartGame, gameStatus]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    const newControls = { ...controls };
    
    switch (key) {
      case 'arrowleft':
      case 'a':
        newControls.left = false;
        break;
      case 'arrowright':
      case 'd':
        newControls.right = false;
        break;
      case 'arrowup':
      case 'w':
      case ' ':
        newControls.jump = false;
        break;
      case 'arrowdown':
      case 's':
        newControls.crouch = false;
        break;
      case 'shift':
        newControls.run = false;
        break;
    }
    
    setControls(newControls);
  }, [controls, setControls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};