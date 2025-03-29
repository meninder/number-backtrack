
// Main game logic exports
import { GameState, Step, Operation, Difficulty } from './types';
import { performOperation, getInverseOperation, calculateReverseStep, isCorrectReverseStep, isStepCompleted } from './operations';
import { generateGame, shuffleArray } from './gameGenerator';

// Re-export all needed functions and types
export {
  Operation,
  Difficulty,
  Step,
  GameState,
  performOperation,
  getInverseOperation,
  calculateReverseStep,
  isCorrectReverseStep,
  isStepCompleted,
  generateGame,
  shuffleArray
};

