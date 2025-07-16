import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Controls, GAME_CONFIG } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
  controls: Controls;
  onGameUpdate: (deltaTime: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  controls, 
  onGameUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Draw Mario with Super Nintendo style and animation
  const drawMario = useCallback((ctx: CanvasRenderingContext2D, mario: any, camera: any) => {
    const x = mario.x - camera.x;
    const y = mario.y;
    const isFlashing = mario.invulnerable && Date.now() % 200 < 100;
    const height = mario.height;
    
    // Determine sprite based on state and animation
    const isWalking = mario.isWalking && mario.onGround;
    const isCrouching = mario.isCrouching;
    const animFrame = mario.animationFrame;
    
    if (mario.state === 'small') {
      // Small Mario
      // Hat (red)
      ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c';
      ctx.fillRect(x + 6, y, 12, 6);
      ctx.fillRect(x + 4, y + 2, 16, 4);
      
      // Face (peach)
      ctx.fillStyle = isFlashing ? '#ffddcc' : '#ffcc99';
      ctx.fillRect(x + 8, y + 6, 8, 6);
      
      // Mustache (brown)
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(x + 8, y + 10, 8, 2);
      
      // Shirt (red)
      ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c';
      ctx.fillRect(x + 6, y + 12, 12, 8);
      
      // Overalls (blue)
      ctx.fillStyle = '#4169e1';
      ctx.fillRect(x + 8, y + 16, 8, 4);
      
      // Animated legs/shoes (brown)
      ctx.fillStyle = '#8b4513';
      if (isWalking) {
        // Walking animation - alternate leg positions
        if (animFrame === 1) {
          // Left leg forward
          ctx.fillRect(x + 2, y + 20, 6, 4);
          ctx.fillRect(x + 16, y + 20, 6, 4);
        } else if (animFrame === 2) {
          // Right leg forward
          ctx.fillRect(x + 6, y + 20, 6, 4);
          ctx.fillRect(x + 12, y + 20, 6, 4);
        } else {
          // Standing position
          ctx.fillRect(x + 4, y + 20, 6, 4);
          ctx.fillRect(x + 14, y + 20, 6, 4);
        }
      } else {
        // Standing position
        ctx.fillRect(x + 4, y + 20, 6, 4);
        ctx.fillRect(x + 14, y + 20, 6, 4);
      }
    } else {
      // Super/Fire Mario (taller)
      if (isCrouching) {
        // Crouching Super/Fire Mario - shorter and wider
        // Hat (red)
        ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c';
        ctx.fillRect(x + 6, y + 8, 12, 6);
        ctx.fillRect(x + 4, y + 10, 16, 4);
        
        // Face (peach)
        ctx.fillStyle = isFlashing ? '#ffddcc' : '#ffcc99';
        ctx.fillRect(x + 8, y + 14, 8, 6);
        
        // Mustache (brown)
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 8, y + 18, 8, 2);
        
        // Shirt color based on state
        if (mario.state === 'fire') {
          ctx.fillStyle = isFlashing ? '#ffaa99' : '#ff6347'; // Fire Mario - orange/red
        } else {
          ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c'; // Super Mario - red
        }
        ctx.fillRect(x + 6, y + 20, 12, 4);
        
        // Overalls (blue) - crouched
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(x + 2, y + 20, 20, 4);
        
        // Fire Mario special effects when crouching
        if (mario.state === 'fire') {
          ctx.fillStyle = '#ffd700'; // Gold highlights
          ctx.fillRect(x + 7, y + 21, 2, 2);
          ctx.fillRect(x + 15, y + 21, 2, 2);
        }
      } else {
        // Standing Super/Fire Mario
        // Hat (red)
        ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c';
        ctx.fillRect(x + 6, y, 12, 6);
        ctx.fillRect(x + 4, y + 2, 16, 4);
        
        // Face (peach)
        ctx.fillStyle = isFlashing ? '#ffddcc' : '#ffcc99';
        ctx.fillRect(x + 8, y + 6, 8, 8);
        
        // Mustache (brown)
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 8, y + 12, 8, 2);
        
        // Shirt color based on state
        if (mario.state === 'fire') {
          ctx.fillStyle = isFlashing ? '#ffaa99' : '#ff6347'; // Fire Mario - orange/red
        } else {
          ctx.fillStyle = isFlashing ? '#ff9999' : '#dc143c'; // Super Mario - red
        }
        ctx.fillRect(x + 6, y + 14, 12, 10);
        
        // Overalls (blue)
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(x + 8, y + 20, 8, 6);
        
        // Animated legs/shoes (brown)
        ctx.fillStyle = '#8b4513';
        if (isWalking) {
          // Walking animation - alternate leg positions
          if (animFrame === 1) {
            // Left leg forward
            ctx.fillRect(x + 2, y + 26, 6, 6);
            ctx.fillRect(x + 16, y + 26, 6, 6);
          } else if (animFrame === 2) {
            // Right leg forward
            ctx.fillRect(x + 6, y + 26, 6, 6);
            ctx.fillRect(x + 12, y + 26, 6, 6);
          } else {
            // Standing position
            ctx.fillRect(x + 4, y + 26, 6, 6);
            ctx.fillRect(x + 14, y + 26, 6, 6);
          }
        } else {
          // Standing position
          ctx.fillRect(x + 4, y + 26, 6, 6);
          ctx.fillRect(x + 14, y + 26, 6, 6);
        }
        
        // Fire Mario special effects
        if (mario.state === 'fire') {
          ctx.fillStyle = '#ffd700'; // Gold highlights
          ctx.fillRect(x + 7, y + 15, 2, 8);
          ctx.fillRect(x + 15, y + 15, 2, 8);
        }
      }
    }
    
    // Add some pixel art details
    // Eyes (black dots)
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 10, y + 8, 1, 1);
    ctx.fillRect(x + 13, y + 8, 1, 1);
    
    // Buttons on overalls
    ctx.fillStyle = '#ffd700';
    if (mario.state !== 'small') {
      ctx.fillRect(x + 9, y + 21, 1, 1);
      ctx.fillRect(x + 14, y + 21, 1, 1);
    }
  }, []);

  // Draw Enemy
  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: any, camera: any) => {
    if (!enemy.active || enemy.defeated) return;
    
    const x = enemy.x - camera.x;
    const y = enemy.y;
    
    if (enemy.type === 'goomba') {
      // Goomba body (brown)
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, enemy.width, enemy.height);
      
      // Goomba eyes (white)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 4, 4, 4);
      ctx.fillRect(x + 16, y + 4, 4, 4);
      
      // Goomba pupils (black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 6, y + 6, 2, 2);
      ctx.fillRect(x + 18, y + 6, 2, 2);
      
      // Goomba frown
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 8, y + 16, 8, 2);
    } else if (enemy.type === 'koopa') {
      // Koopa shell (green)
      ctx.fillStyle = '#00aa00';
      ctx.fillRect(x, y + 8, enemy.width, 16);
      
      // Koopa head (yellow)
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x + 4, y, 16, 12);
      
      // Koopa shell pattern
      ctx.fillStyle = '#008800';
      ctx.fillRect(x + 4, y + 12, 4, 4);
      ctx.fillRect(x + 16, y + 12, 4, 4);
      ctx.fillRect(x + 10, y + 20, 4, 4);
    }
  }, []);

  // Draw Block
  const drawBlock = useCallback((ctx: CanvasRenderingContext2D, block: any, camera: any) => {
    if (!block.active) return;
    
    const x = block.x - camera.x;
    const y = block.y;
    
    switch (block.type) {
      case 'ground':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, block.width, block.height);
        // Ground texture
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < block.width; i += 8) {
          for (let j = 0; j < block.height; j += 8) {
            ctx.fillRect(x + i, y + j, 4, 4);
          }
        }
        break;
        
      case 'brick':
        ctx.fillStyle = '#cc6600';
        ctx.fillRect(x, y, block.width, block.height);
        // Brick pattern
        ctx.fillStyle = '#aa5500';
        ctx.fillRect(x + 2, y + 2, block.width - 4, 4);
        ctx.fillRect(x + 2, y + 18, block.width - 4, 4);
        ctx.fillRect(x + 2, y + 10, 12, 4);
        ctx.fillRect(x + 18, y + 10, 12, 4);
        break;
        
      case 'question':
        ctx.fillStyle = block.hit ? '#cc6600' : '#ffaa00';
        ctx.fillRect(x, y, block.width, block.height);
        if (!block.hit) {
          // Question mark
          ctx.fillStyle = '#000000';
          ctx.fillRect(x + 12, y + 8, 8, 4);
          ctx.fillRect(x + 16, y + 4, 4, 4);
          ctx.fillRect(x + 16, y + 20, 4, 4);
        }
        break;
        
      case 'pipe':
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(x, y, block.width, block.height);
        // Pipe highlights
        ctx.fillStyle = '#00cc00';
        ctx.fillRect(x + 4, y, 4, block.height);
        ctx.fillRect(x + block.width - 8, y, 4, block.height);
        
        // Special indicator for enterable pipes
        if (block.canEnter) {
          // Animated glow effect
          const glowIntensity = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 255, 0, ${glowIntensity})`;
          ctx.fillRect(x + block.width/2 - 3, y + 2, 6, 6);
          
          // Down arrow indicator
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + block.width/2 - 1, y + 6, 2, 4);
          ctx.fillRect(x + block.width/2 - 2, y + 8, 4, 2);
          ctx.fillRect(x + block.width/2 - 3, y + 9, 6, 1);
        }
        break;
    }
  }, []);

  // Draw Power-up
  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, powerUp: any, camera: any) => {
    if (!powerUp.active || powerUp.collected) return;
    
    const x = powerUp.x - camera.x;
    const y = powerUp.y;
    
    switch (powerUp.type) {
      case 'coin':
        ctx.fillStyle = '#ffdd00';
        ctx.fillRect(x, y, powerUp.width, powerUp.height);
        // Coin shine
        ctx.fillStyle = '#ffff88';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        break;
        
      case 'mushroom':
        // Mushroom cap (red with white spots)
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x, y, powerUp.width, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 4, y + 2, 4, 4);
        ctx.fillRect(x + 12, y + 2, 4, 4);
        
        // Mushroom stem (beige)
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(x + 6, y + 12, 8, 8);
        break;
        
      case 'fireflower':
        // Fire flower petals (red/orange)
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(x, y, powerUp.width, 8);
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        
        // Fire flower center (yellow)
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + 6, y + 6, 4, 4);
        
        // Fire flower stem (green)
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(x + 7, y + 12, 2, 8);
        break;
    }
  }, []);

  // Draw Clouds
  const drawClouds = useCallback((ctx: CanvasRenderingContext2D, camera: any) => {
    const cloudPositions = [
      { x: 200, y: 80 },
      { x: 600, y: 120 },
      { x: 1000, y: 90 },
      { x: 1400, y: 110 },
      { x: 1800, y: 85 },
      { x: 2200, y: 125 },
      { x: 2600, y: 95 },
      { x: 3000, y: 105 },
    ];
    
    ctx.fillStyle = '#ffffff';
    cloudPositions.forEach(cloud => {
      const x = cloud.x - camera.x * 0.3; // Parallax effect
      const y = cloud.y;
      
      // Only draw if cloud is visible
      if (x > -100 && x < GAME_CONFIG.CANVAS_WIDTH + 50) {
        // Cloud body (main circles)
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 15, y - 15, 15, 0, Math.PI * 2);
        ctx.arc(x + 35, y - 15, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, []);

  // Draw HUD
  const drawHUD = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    ctx.fillStyle = '#000000';
    ctx.font = '16px monospace';
    
    // Score
    ctx.fillText(`SCORE: ${gameState.score.toString().padStart(6, '0')}`, 10, 25);
    
    // Coins
    ctx.fillText(`COINS: ${gameState.coins.toString().padStart(2, '0')}`, 200, 25);
    
    // World
    ctx.fillText(`WORLD: ${gameState.world}-${gameState.level}`, 350, 25);
    
    // Time
    ctx.fillText(`TIME: ${Math.ceil(gameState.time).toString().padStart(3, '0')}`, 500, 25);
    
    // Lives
    ctx.fillText(`LIVES: ${gameState.mario.lives}`, 650, 25);
    
    // Underground indicator
    if (gameState.isUnderground) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px monospace';
      ctx.fillText('UNDERGROUND', 10, 50);
    }
    
    // Pipe entry hint
    const mario = gameState.mario;
    const pipes = gameState.blocks.filter(block => 
      block.type === 'pipe' && block.canEnter && block.active
    );
    
    for (const pipe of pipes) {
      const marioCenterX = mario.x + mario.width / 2;
      const pipeCenterX = pipe.x + pipe.width / 2;
      const marioBottom = mario.y + mario.height;
      const pipeTop = pipe.y;
      
      // Check if Mario is near a pipe
      if (Math.abs(marioCenterX - pipeCenterX) < pipe.width / 2 + 20 && 
          marioBottom >= pipeTop - 10 && 
          marioBottom <= pipeTop + 15) {
        
        // Draw hint text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        const hintText = gameState.isUnderground ? 'CROUCH TO EXIT' : 'CROUCH TO ENTER';
        const textWidth = ctx.measureText(hintText).width;
        const textX = (pipe.x + pipe.width / 2) - gameState.camera.x - textWidth / 2;
        const textY = pipe.y - 20;
        
        // Background for text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(textX - 5, textY - 15, textWidth + 10, 20);
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(hintText, textX, textY);
        break;
      }
    }
  }, []);

  // Main render function
  const render = useCallback((ctx: CanvasRenderingContext2D, gameState: GameState) => {
    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    if (gameState.isUnderground) {
      // Underground background - dark with brick pattern
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      // Add some underground atmosphere with dark blue tint
      const undergroundGradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
      undergroundGradient.addColorStop(0, 'rgba(0, 0, 50, 0.8)');
      undergroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = undergroundGradient;
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    } else {
      // Surface background - sky with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
      gradient.addColorStop(0, '#5c9bd5');
      gradient.addColorStop(0.7, '#87ceeb');
      gradient.addColorStop(1, '#b0e0e6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      // Draw clouds (behind everything) - only on surface
      drawClouds(ctx, gameState.camera);
    }
    
    // Draw game objects
    gameState.blocks.forEach(block => drawBlock(ctx, block, gameState.camera));
    gameState.powerUps.forEach(powerUp => drawPowerUp(ctx, powerUp, gameState.camera));
    gameState.enemies.forEach(enemy => drawEnemy(ctx, enemy, gameState.camera));
    drawMario(ctx, gameState.mario, gameState.camera);
    
    // Draw HUD
    drawHUD(ctx, gameState);
  }, [drawMario, drawEnemy, drawBlock, drawPowerUp, drawClouds, drawHUD]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Update game logic
    if (gameState.gameStatus === 'playing') {
      onGameUpdate(deltaTime);
    }
    
    // Render
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      render(ctx, gameState);
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, onGameUpdate, render]);

  // Start game loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="border-4 border-gray-800 bg-sky-200 pixel-art"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};