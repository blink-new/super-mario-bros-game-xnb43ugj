import React, { useState, useEffect } from 'react';
import { StartMenu } from './components/StartMenu';
import { GameCanvas } from './components/GameCanvas';
import { GameOverScreen } from './components/GameOverScreen';
import { ControlsModal } from './components/ControlsModal';
import { MobileControls } from './components/MobileControls';
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useIsMobile } from './hooks/use-mobile';
import { useAudio } from './hooks/useAudio';
import { Button } from './components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

function App() {
  const [showControls, setShowControls] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    gameState,
    controls,
    setControls,
    updateGame,
    startGame,
    pauseGame,
    restartGame,
    goToMenu,
  } = useGameLogic();

  const {
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleMute,
    isMuted,
    isPlaying,
  } = useAudio();

  useKeyboardControls({
    controls,
    setControls,
    onStartGame: startGame,
    onPauseGame: pauseGame,
    onRestartGame: restartGame,
    gameStatus: gameState.gameStatus,
  });

  const handleShowControls = () => {
    setShowControls(true);
  };

  const handleCloseControls = () => {
    setShowControls(false);
  };

  // Start music when game starts
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !isPlaying && !isMuted) {
      startBackgroundMusic();
    } else if (gameState.gameStatus !== 'playing' && isPlaying) {
      stopBackgroundMusic();
    }
  }, [gameState.gameStatus, isPlaying, isMuted, startBackgroundMusic, stopBackgroundMusic]);

  // Render different screens based on game status
  if (gameState.gameStatus === 'menu') {
    return (
      <>
        <StartMenu 
          onStartGame={startGame}
          onShowControls={handleShowControls}
        />
        <ControlsModal 
          isOpen={showControls}
          onClose={handleCloseControls}
        />
      </>
    );
  }

  if (gameState.gameStatus === 'gameover' || gameState.gameStatus === 'victory') {
    return (
      <GameOverScreen
        score={gameState.score}
        coins={gameState.coins}
        world={gameState.world}
        level={gameState.level}
        isVictory={gameState.gameStatus === 'victory'}
        onRestart={restartGame}
        onMainMenu={goToMenu}
      />
    );
  }

  // Game playing screen
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      {/* Game Title */}
      <div className="mb-4">
        <h1 className="font-retro text-2xl text-white text-center">
          SUPER MARIO BROS RECREATION
        </h1>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <GameCanvas
          gameState={gameState}
          controls={controls}
          onGameUpdate={updateGame}
        />
        
        {/* Pause Overlay */}
        {gameState.gameStatus === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="font-retro text-3xl text-white">PAUSED</h2>
              <p className="font-retro text-sm text-gray-300">
                {isMobile ? 'Touch RESUME to continue' : 'Press P to continue'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Controls Info - Only show on desktop */}
      {!isMobile && (
        <div className="mt-4 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-4 text-xs font-retro text-gray-300">
            <span>ARROW KEYS/WASD: Move</span>
            <span>SPACE: Jump</span>
            <span>SHIFT: Run</span>
            <span>P: Pause</span>
            <span>R: Restart</span>
          </div>
          
          <div className="flex justify-center gap-2">
            <Button
              onClick={pauseGame}
              className="font-retro text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {gameState.gameStatus === 'paused' ? 'RESUME' : 'PAUSE'}
            </Button>
            
            <Button
              onClick={restartGame}
              className="font-retro text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white"
            >
              RESTART
            </Button>
            
            <Button
              onClick={goToMenu}
              className="font-retro text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              MENU
            </Button>

            <Button
              onClick={toggleMute}
              className="font-retro text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Controls - Only show on mobile devices */}
      {isMobile && (
        <MobileControls
          controls={controls}
          setControls={setControls}
          onPause={pauseGame}
          onRestart={restartGame}
          onMenu={goToMenu}
          gameStatus={gameState.gameStatus}
        />
      )}

      {/* Mobile spacing to prevent overlap with fixed controls */}
      {isMobile && <div className="h-48"></div>}
    </div>
  );
}

export default App;