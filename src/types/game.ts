export interface Mario {
  id: string;
  type: 'mario';
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  onGround: boolean;
  direction: 'left' | 'right';
  state: 'small' | 'super' | 'fire';
  invulnerable: boolean;
  lives: number;
  active: boolean;
  animationFrame: number;
  animationTimer: number;
  isWalking: boolean;
  isCrouching: boolean;
}

export interface Enemy {
  id: string;
  type: 'goomba' | 'koopa';
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  direction: 'left' | 'right';
  defeated: boolean;
  active: boolean;
}

export interface Block {
  id: string;
  type: 'ground' | 'brick' | 'question' | 'pipe';
  x: number;
  y: number;
  width: number;
  height: number;
  solid: boolean;
  breakable: boolean;
  active: boolean;
  hit?: boolean;
  hasItem?: PowerUp;
  canEnter?: boolean; // For pipes that can be entered
}

export interface PowerUp {
  id: string;
  type: 'coin' | 'mushroom' | 'fireflower';
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  collected: boolean;
  active: boolean;
}

export interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  crouch: boolean;
}

export interface Camera {
  x: number;
  y: number;
}

export interface GameState {
  mario: Mario;
  enemies: Enemy[];
  blocks: Block[];
  powerUps: PowerUp[];
  score: number;
  coins: number;
  time: number;
  world: string;
  level: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';
  camera: Camera;
  isUnderground: boolean;
  pipeTransition: {
    active: boolean;
    direction: 'entering' | 'exiting';
    progress: number;
  };
}

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TILE_SIZE: 32,
  GROUND_LEVEL: 500,
  GRAVITY: 0.8,
  MARIO_SPEED: 4,
  MARIO_RUN_SPEED: 6,
  MARIO_JUMP_POWER: 15,
  ENEMY_SPEED: 1,
};