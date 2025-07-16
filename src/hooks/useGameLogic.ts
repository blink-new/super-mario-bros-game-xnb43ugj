import { useState, useCallback, useRef } from 'react';
import { GameState, Controls, Mario, Enemy, Block, PowerUp, GAME_CONFIG } from '../types/game';
import { useAudio } from './useAudio';

const createInitialMario = (): Mario => ({
  id: 'mario',
  type: 'mario',
  x: 100,
  y: GAME_CONFIG.GROUND_LEVEL - 32,
  width: 24,
  height: 32,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
  direction: 'right',
  state: 'small',
  invulnerable: false,
  lives: 3,
  active: true,
  animationFrame: 0,
  animationTimer: 0,
  isWalking: false,
  isCrouching: false,
});

const createInitialBlocks = (): Block[] => {
  const blocks: Block[] = [];
  
  // Ground blocks - create a long continuous ground
  for (let i = 0; i < 200; i++) {
    blocks.push({
      id: `ground-${i}`,
      type: 'ground' as const,
      x: i * GAME_CONFIG.TILE_SIZE,
      y: GAME_CONFIG.GROUND_LEVEL,
      width: GAME_CONFIG.TILE_SIZE,
      height: GAME_CONFIG.TILE_SIZE * 3,
      solid: true,
      breakable: false,
      active: true,
    });
  }
  
  // Add various blocks throughout the level
  const levelElements = [
    // First question block with mushroom
    { type: 'question', x: 300, hasItem: true, itemType: 'mushroom' },
    // Other question blocks with coins
    { type: 'question', x: 500, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 800, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 1200, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 1600, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 2000, hasItem: true, itemType: 'coin' },
    
    // Brick blocks
    { type: 'brick', x: 350 },
    { type: 'brick', x: 450 },
    { type: 'brick', x: 550 },
    { type: 'brick', x: 750 },
    { type: 'brick', x: 850 },
    { type: 'brick', x: 950 },
    { type: 'brick', x: 1150 },
    { type: 'brick', x: 1250 },
    { type: 'brick', x: 1350 },
    { type: 'brick', x: 1550 },
    { type: 'brick', x: 1650 },
    { type: 'brick', x: 1750 },
    
    // Pipes at various locations (first one can be entered)
    { type: 'pipe', x: 700, canEnter: true },
    { type: 'pipe', x: 1400 },
    { type: 'pipe', x: 2200 },
    { type: 'pipe', x: 3000 },
  ];
  
  levelElements.forEach((element, index) => {
    if (element.type === 'question') {
      blocks.push({
        id: `question-${index}`,
        type: 'question' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 100,
        width: GAME_CONFIG.TILE_SIZE,
        height: GAME_CONFIG.TILE_SIZE,
        solid: true,
        breakable: false,
        active: true,
        hasItem: element.hasItem ? {
          id: `${element.itemType}-${index}`,
          type: element.itemType as 'coin' | 'mushroom',
          x: element.x,
          y: GAME_CONFIG.GROUND_LEVEL - 120,
          width: element.itemType === 'mushroom' ? 20 : 16,
          height: element.itemType === 'mushroom' ? 20 : 16,
          velocityX: element.itemType === 'mushroom' ? 1 : 0,
          velocityY: -5,
          collected: false,
          active: true,
        } : undefined,
      });
    } else if (element.type === 'brick') {
      blocks.push({
        id: `brick-${index}`,
        type: 'brick' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 100,
        width: GAME_CONFIG.TILE_SIZE,
        height: GAME_CONFIG.TILE_SIZE,
        solid: true,
        breakable: true,
        active: true,
      });
    } else if (element.type === 'pipe') {
      blocks.push({
        id: `pipe-${index}`,
        type: 'pipe' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 64,
        width: GAME_CONFIG.TILE_SIZE * 2,
        height: GAME_CONFIG.TILE_SIZE * 2,
        solid: true,
        breakable: false,
        active: true,
        canEnter: element.canEnter || false,
      });
    }
  });
  
  return blocks;
};

const createUndergroundBlocks = (): Block[] => {
  const blocks: Block[] = [];
  
  // Underground ground blocks - create a long continuous ground
  for (let i = 0; i < 100; i++) {
    blocks.push({
      id: `underground-ground-${i}`,
      type: 'ground' as const,
      x: i * GAME_CONFIG.TILE_SIZE,
      y: GAME_CONFIG.GROUND_LEVEL,
      width: GAME_CONFIG.TILE_SIZE,
      height: GAME_CONFIG.TILE_SIZE * 3,
      solid: true,
      breakable: false,
      active: true,
    });
  }
  
  // Underground ceiling blocks
  for (let i = 0; i < 100; i++) {
    blocks.push({
      id: `underground-ceiling-${i}`,
      type: 'ground' as const,
      x: i * GAME_CONFIG.TILE_SIZE,
      y: 50,
      width: GAME_CONFIG.TILE_SIZE,
      height: GAME_CONFIG.TILE_SIZE,
      solid: true,
      breakable: false,
      active: true,
    });
  }
  
  // Underground elements
  const undergroundElements = [
    // Question blocks with coins
    { type: 'question', x: 200, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 400, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 600, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 800, hasItem: true, itemType: 'coin' },
    { type: 'question', x: 1000, hasItem: true, itemType: 'coin' },
    
    // Brick blocks
    { type: 'brick', x: 250 },
    { type: 'brick', x: 350 },
    { type: 'brick', x: 450 },
    { type: 'brick', x: 550 },
    { type: 'brick', x: 650 },
    { type: 'brick', x: 750 },
    { type: 'brick', x: 850 },
    { type: 'brick', x: 950 },
    
    // Exit pipe
    { type: 'pipe', x: 1200, canEnter: true },
  ];
  
  undergroundElements.forEach((element, index) => {
    if (element.type === 'question') {
      blocks.push({
        id: `underground-question-${index}`,
        type: 'question' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 100,
        width: GAME_CONFIG.TILE_SIZE,
        height: GAME_CONFIG.TILE_SIZE,
        solid: true,
        breakable: false,
        active: true,
        hasItem: element.hasItem ? {
          id: `underground-${element.itemType}-${index}`,
          type: element.itemType as 'coin' | 'mushroom',
          x: element.x,
          y: GAME_CONFIG.GROUND_LEVEL - 120,
          width: element.itemType === 'mushroom' ? 20 : 16,
          height: element.itemType === 'mushroom' ? 20 : 16,
          velocityX: element.itemType === 'mushroom' ? 1 : 0,
          velocityY: -5,
          collected: false,
          active: true,
        } : undefined,
      });
    } else if (element.type === 'brick') {
      blocks.push({
        id: `underground-brick-${index}`,
        type: 'brick' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 100,
        width: GAME_CONFIG.TILE_SIZE,
        height: GAME_CONFIG.TILE_SIZE,
        solid: true,
        breakable: true,
        active: true,
      });
    } else if (element.type === 'pipe') {
      blocks.push({
        id: `underground-pipe-${index}`,
        type: 'pipe' as const,
        x: element.x,
        y: GAME_CONFIG.GROUND_LEVEL - 64,
        width: GAME_CONFIG.TILE_SIZE * 2,
        height: GAME_CONFIG.TILE_SIZE * 2,
        solid: true,
        breakable: false,
        active: true,
        canEnter: element.canEnter || false,
      });
    }
  });
  
  return blocks;
};

const createInitialEnemies = (): Enemy[] => {
  const enemies: Enemy[] = [];
  
  // Goombas at various positions
  const goombaPositions = [500, 900, 1300, 1700, 2100, 2500, 2900, 3300];
  goombaPositions.forEach((x, index) => {
    enemies.push({
      id: `goomba-${index}`,
      type: 'goomba',
      x,
      y: GAME_CONFIG.GROUND_LEVEL - 24,
      width: 24,
      height: 24,
      velocityX: -GAME_CONFIG.ENEMY_SPEED,
      velocityY: 0,
      direction: 'left',
      defeated: false,
      active: true,
    });
  });
  
  // Koopas at various positions
  const koopaPositions = [800, 1100, 1500, 1900, 2300, 2700, 3100];
  koopaPositions.forEach((x, index) => {
    enemies.push({
      id: `koopa-${index}`,
      type: 'koopa',
      x,
      y: GAME_CONFIG.GROUND_LEVEL - 32,
      width: 24,
      height: 32,
      velocityX: -GAME_CONFIG.ENEMY_SPEED,
      velocityY: 0,
      direction: 'left',
      defeated: false,
      active: true,
    });
  });
  
  return enemies;
};

const createInitialGameState = (): GameState => ({
  mario: createInitialMario(),
  enemies: createInitialEnemies(),
  blocks: createInitialBlocks(),
  powerUps: [],
  score: 0,
  coins: 0,
  time: 400,
  world: '1',
  level: 1,
  gameStatus: 'menu',
  camera: { x: 0, y: 0 },
  isUnderground: false,
  pipeTransition: {
    active: false,
    direction: 'entering',
    progress: 0,
  },
});

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [controls, setControls] = useState<Controls>({
    left: false,
    right: false,
    jump: false,
    run: false,
    crouch: false,
  });
  
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  
  const { playJumpSound, playPipeSound } = useAudio();

  // Collision detection
  const checkCollision = useCallback((obj1: any, obj2: any) => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }, []);

  // Update Mario physics
  const updateMario = useCallback((mario: Mario, deltaTime: number, blocks: Block[]) => {
    const newMario = { ...mario };
    const speed = controls.run ? GAME_CONFIG.MARIO_RUN_SPEED : GAME_CONFIG.MARIO_SPEED;

    // Handle crouching
    newMario.isCrouching = controls.crouch && newMario.onGround;
    
    // Adjust Mario's height when crouching (only for Super/Fire Mario)
    if (newMario.isCrouching && newMario.state !== 'small') {
      newMario.height = 24; // Shorter when crouching
    } else {
      newMario.height = newMario.state === 'small' ? 24 : 32;
    }

    // Horizontal movement (can't move while crouching)
    if (!newMario.isCrouching) {
      if (controls.left) {
        newMario.velocityX = -speed;
        newMario.direction = 'left';
        newMario.isWalking = true;
      } else if (controls.right) {
        newMario.velocityX = speed;
        newMario.direction = 'right';
        newMario.isWalking = true;
      } else {
        newMario.velocityX *= 0.8; // Friction
        newMario.isWalking = false;
      }
    } else {
      newMario.velocityX *= 0.8; // Friction when crouching
      newMario.isWalking = false;
    }

    // Animation timer for walking
    if (newMario.isWalking && Math.abs(newMario.velocityX) > 0.5) {
      newMario.animationTimer += deltaTime;
      if (newMario.animationTimer > 150) { // Change frame every 150ms
        newMario.animationFrame = (newMario.animationFrame + 1) % 3; // 3 walking frames
        newMario.animationTimer = 0;
      }
    } else {
      newMario.animationFrame = 0; // Standing frame
      newMario.animationTimer = 0;
    }

    // Jumping
    if (controls.jump && newMario.onGround && !newMario.isCrouching) {
      newMario.velocityY = -GAME_CONFIG.MARIO_JUMP_POWER;
      newMario.onGround = false;
      playJumpSound(); // Play jump sound effect
    }

    // Apply gravity
    if (!newMario.onGround) {
      newMario.velocityY += GAME_CONFIG.GRAVITY;
    }

    // Store old position
    const oldX = newMario.x;
    const oldY = newMario.y;

    // Update horizontal position
    newMario.x += newMario.velocityX;

    // Check horizontal collisions with solid blocks
    const solidBlocks = blocks.filter(block => block.active && block.solid);
    for (const block of solidBlocks) {
      if (checkCollision(newMario, block)) {
        // Horizontal collision - push Mario back
        if (newMario.velocityX > 0) {
          // Moving right, hit left side of block
          newMario.x = block.x - newMario.width;
        } else if (newMario.velocityX < 0) {
          // Moving left, hit right side of block
          newMario.x = block.x + block.width;
        }
        newMario.velocityX = 0;
        break;
      }
    }

    // Update vertical position
    newMario.y += newMario.velocityY;

    // Check vertical collisions with solid blocks
    newMario.onGround = false;
    for (const block of solidBlocks) {
      if (checkCollision(newMario, block)) {
        if (newMario.velocityY > 0) {
          // Falling down, hit top of block
          newMario.y = block.y - newMario.height;
          newMario.velocityY = 0;
          newMario.onGround = true;
        } else if (newMario.velocityY < 0) {
          // Jumping up, hit bottom of block
          newMario.y = block.y + block.height;
          newMario.velocityY = 0;
        }
        break;
      }
    }

    // Ground collision (fallback)
    if (newMario.y >= GAME_CONFIG.GROUND_LEVEL - newMario.height) {
      newMario.y = GAME_CONFIG.GROUND_LEVEL - newMario.height;
      newMario.velocityY = 0;
      newMario.onGround = true;
    }

    // Screen boundaries
    if (newMario.x < 0) newMario.x = 0;

    return newMario;
  }, [controls, checkCollision, playJumpSound]);

  // Update enemies
  const updateEnemies = useCallback((enemies: Enemy[], blocks: Block[]) => {
    return enemies.map(enemy => {
      if (!enemy.active || enemy.defeated) return enemy;

      const newEnemy = { ...enemy };
      const oldX = newEnemy.x;
      
      // Move enemy horizontally
      newEnemy.x += newEnemy.velocityX;
      
      // Check horizontal collisions with solid blocks
      const solidBlocks = blocks.filter(block => block.active && block.solid);
      for (const block of solidBlocks) {
        if (checkCollision(newEnemy, block)) {
          // Hit a wall, reverse direction
          newEnemy.x = oldX;
          newEnemy.velocityX *= -1;
          newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
          break;
        }
      }
      
      // Apply gravity
      newEnemy.velocityY += GAME_CONFIG.GRAVITY;
      newEnemy.y += newEnemy.velocityY;
      
      // Check vertical collisions with solid blocks
      for (const block of solidBlocks) {
        if (checkCollision(newEnemy, block)) {
          if (newEnemy.velocityY > 0) {
            // Falling down, hit top of block
            newEnemy.y = block.y - newEnemy.height;
            newEnemy.velocityY = 0;
          }
          break;
        }
      }
      
      // Ground collision (fallback)
      if (newEnemy.y >= GAME_CONFIG.GROUND_LEVEL - newEnemy.height) {
        newEnemy.y = GAME_CONFIG.GROUND_LEVEL - newEnemy.height;
        newEnemy.velocityY = 0;
      }
      
      // Reverse direction at screen edges
      if (newEnemy.x <= 0 || newEnemy.x >= 6000) {
        newEnemy.velocityX *= -1;
        newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
      }
      
      // Check for cliffs (prevent enemies from walking off platforms)
      const futureX = newEnemy.x + newEnemy.velocityX * 10;
      const futureY = newEnemy.y + newEnemy.height + 10;
      let foundGround = false;
      
      for (const block of solidBlocks) {
        if (futureX >= block.x && futureX <= block.x + block.width && 
            futureY >= block.y && futureY <= block.y + block.height) {
          foundGround = true;
          break;
        }
      }
      
      // Also check for ground level
      if (futureY >= GAME_CONFIG.GROUND_LEVEL) {
        foundGround = true;
      }
      
      if (!foundGround) {
        // No ground ahead, reverse direction
        newEnemy.velocityX *= -1;
        newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
      }

      return newEnemy;
    });
  }, [checkCollision]);

  // Update power-ups
  const updatePowerUps = useCallback((powerUps: PowerUp[]) => {
    return powerUps.map(powerUp => {
      if (!powerUp.active || powerUp.collected) return powerUp;

      const newPowerUp = { ...powerUp };
      
      // Move power-up
      newPowerUp.x += newPowerUp.velocityX;
      newPowerUp.y += newPowerUp.velocityY;
      
      // Apply gravity for mushrooms and fire flowers
      if (newPowerUp.type !== 'coin') {
        newPowerUp.velocityY += GAME_CONFIG.GRAVITY * 0.5;
        
        // Ground collision
        if (newPowerUp.y >= GAME_CONFIG.GROUND_LEVEL - newPowerUp.height) {
          newPowerUp.y = GAME_CONFIG.GROUND_LEVEL - newPowerUp.height;
          newPowerUp.velocityY = 0;
        }
      }

      return newPowerUp;
    });
  }, []);

  // Handle pipe entry
  const handlePipeEntry = useCallback((state: GameState) => {
    const newState = { ...state };
    const mario = newState.mario;
    
    // Check if Mario is crouching on a pipe that can be entered
    if (mario.isCrouching && mario.onGround) {
      const pipes = newState.blocks.filter(block => 
        block.type === 'pipe' && block.canEnter && block.active
      );
      
      for (const pipe of pipes) {
        // Check if Mario is on top of the pipe (more lenient detection)
        const marioBottom = mario.y + mario.height;
        const pipeTop = pipe.y;
        const marioCenterX = mario.x + mario.width / 2;
        const pipeCenterX = pipe.x + pipe.width / 2;
        
        // Mario must be standing on the pipe and roughly centered
        if (Math.abs(marioCenterX - pipeCenterX) < pipe.width / 2 + 10 && 
            marioBottom >= pipeTop - 5 && 
            marioBottom <= pipeTop + 10) {
          
          // Start pipe transition
          if (!newState.isUnderground) {
            // Going underground
            playPipeSound(); // Play pipe entry sound
            newState.pipeTransition = {
              active: true,
              direction: 'entering',
              progress: 0,
            };
            
            // After transition, switch to underground
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                isUnderground: true,
                blocks: createUndergroundBlocks(),
                enemies: [], // No enemies in underground for now
                mario: {
                  ...prev.mario,
                  x: 100, // Reset position
                  y: GAME_CONFIG.GROUND_LEVEL - prev.mario.height,
                },
                camera: { x: 0, y: 0 },
                pipeTransition: {
                  active: false,
                  direction: 'entering',
                  progress: 0,
                },
              }));
            }, 1000);
          } else {
            // Going back to surface
            newState.pipeTransition = {
              active: true,
              direction: 'exiting',
              progress: 0,
            };
            
            // After transition, switch to surface
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                isUnderground: false,
                blocks: createInitialBlocks(),
                enemies: createInitialEnemies(),
                mario: {
                  ...prev.mario,
                  x: 750, // Position near the first pipe
                  y: GAME_CONFIG.GROUND_LEVEL - prev.mario.height,
                },
                camera: { x: 350, y: 0 },
                pipeTransition: {
                  active: false,
                  direction: 'exiting',
                  progress: 0,
                },
              }));
            }, 1000);
          }
          break;
        }
      }
    }
    
    return newState;
  }, [playPipeSound]);

  // Handle collisions
  const handleCollisions = useCallback((state: GameState) => {
    const newState = { ...state };
    let mario = { ...newState.mario };
    let enemies = [...newState.enemies];
    let powerUps = [...newState.powerUps];
    let blocks = [...newState.blocks];

    // Mario vs Enemies
    enemies = enemies.map(enemy => {
      if (!enemy.active || enemy.defeated) return enemy;
      
      if (checkCollision(mario, enemy)) {
        // Check if Mario is jumping on enemy
        if (mario.velocityY > 0 && mario.y < enemy.y) {
          const newEnemy = { ...enemy, defeated: true, active: false };
          mario = { ...mario, velocityY: -5 }; // Bounce
          newState.score += enemy.type === 'goomba' ? 100 : 200;
          return newEnemy;
        } else if (!mario.invulnerable) {
          // Mario takes damage
          if (mario.state === 'fire') {
            mario = { ...mario, state: 'super' };
          } else if (mario.state === 'super') {
            mario = { ...mario, state: 'small' };
          } else {
            // Game over
            mario = { ...mario, lives: mario.lives - 1 };
            if (mario.lives <= 0) {
              newState.gameStatus = 'gameover';
            }
          }
          mario = { ...mario, invulnerable: true };
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              mario: { ...prev.mario, invulnerable: false }
            }));
          }, 2000);
        }
      }
      return enemy;
    });

    // Mario vs Power-ups
    powerUps = powerUps.map(powerUp => {
      if (!powerUp.active || powerUp.collected) return powerUp;
      
      if (checkCollision(mario, powerUp)) {
        const newPowerUp = { ...powerUp, collected: true, active: false };
        
        switch (powerUp.type) {
          case 'coin':
            newState.coins += 1;
            newState.score += 200;
            break;
          case 'mushroom':
            if (mario.state === 'small') {
              mario = { 
                ...mario, 
                state: 'super', 
                height: 32,
                y: mario.y - 8 // Adjust position when growing
              };
            }
            newState.score += 1000;
            break;
          case 'fireflower':
            mario = { 
              ...mario, 
              state: 'fire', 
              height: 32,
              y: mario.state === 'small' ? mario.y - 8 : mario.y
            };
            newState.score += 1000;
            break;
        }
        
        return newPowerUp;
      }
      return powerUp;
    });

    // Mario vs Blocks (for special interactions like hitting question blocks)
    blocks = blocks.map(block => {
      if (!block.active) return block;
      
      // Check for special block interactions (hitting from below)
      if (block.type === 'question' || block.type === 'brick') {
        // Create a slightly larger collision box for Mario's head
        const marioHead = {
          x: mario.x + 2,
          y: mario.y - 2,
          width: mario.width - 4,
          height: 4
        };
        
        if (checkCollision(marioHead, block) && mario.velocityY < 0) {
          // Mario hit block from below
          if (block.type === 'question' && !block.hit) {
            const newBlock = { ...block, hit: true };
            if (block.hasItem) {
              powerUps.push({ ...block.hasItem, active: true });
            }
            newState.score += 50;
            return newBlock;
          } else if (block.type === 'brick' && block.breakable && mario.state !== 'small') {
            newState.score += 50;
            return { ...block, active: false };
          }
        }
      }
      
      return block;
    });

    newState.mario = mario;
    newState.enemies = enemies;
    newState.powerUps = powerUps;
    newState.blocks = blocks;

    return newState;
  }, [checkCollision]);

  // Update camera
  const updateCamera = useCallback((state: GameState) => {
    const newState = { ...state };
    const targetX = Math.max(0, state.mario.x - GAME_CONFIG.CANVAS_WIDTH / 2);
    newState.camera.x = targetX;
    return newState;
  }, []);

  // Main game update function
  const updateGame = useCallback((deltaTime: number) => {
    if (gameStateRef.current.gameStatus !== 'playing') return;

    setGameState(prevState => {
      let newState = { ...prevState };
      
      // Update game objects
      newState.mario = updateMario(newState.mario, deltaTime, newState.blocks);
      newState.enemies = updateEnemies(newState.enemies, newState.blocks);
      newState.powerUps = updatePowerUps(newState.powerUps);
      
      // Handle pipe entry
      if (!newState.pipeTransition.active) {
        newState = handlePipeEntry(newState);
      }
      
      // Handle collisions
      newState = handleCollisions(newState);
      
      // Update camera
      newState = updateCamera(newState);
      
      // Update timer
      newState.time = Math.max(0, newState.time - deltaTime / 1000);
      if (newState.time <= 0) {
        newState.gameStatus = 'gameover';
      }
      
      return newState;
    });
  }, [updateMario, updateEnemies, updatePowerUps, handleCollisions, updateCamera, handlePipeEntry]);

  // Game control functions
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing' 
    }));
  }, []);

  const restartGame = useCallback(() => {
    setGameState(createInitialGameState());
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const goToMenu = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  return {
    gameState,
    controls,
    setControls,
    updateGame,
    startGame,
    pauseGame,
    restartGame,
    goToMenu,
  };
};