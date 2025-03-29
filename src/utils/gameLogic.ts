
// Main game logic exports
import { GameState, Step, Operation, Difficulty } from './types';
import { performOperation, getInverseOperation, calculateReverseStep, isCorrectReverseStep, isStepCompleted } from './operations';
import { generateGame, shuffleArray } from './gameGenerator';

// Re-export all needed functions and types
export { performOperation, getInverseOperation, calculateReverseStep, isCorrectReverseStep, isStepCompleted, generateGame, shuffleArray };

// Re-export types with the proper syntax for isolatedModules
export type { Operation, Difficulty, Step, GameState };
