
import { Difficulty, Operation } from './types';

// Interface for difficulty configurations
export interface DifficultyConfig {
  startRange: number[];
  steps: number;
  operations: Operation[];
  operandRange: number[];
  multiplierRange?: number[];
  divisorRange?: number[];
}

// Get configuration based on difficulty
export const getDifficultyConfig = (difficulty: Difficulty): DifficultyConfig => {
  const config = {
    easy: {
      startRange: [1, 20],
      steps: 2,
      operations: ['add', 'subtract'] as Operation[],
      operandRange: [1, 10],
    },
    medium: {
      startRange: [1, 50],
      steps: 3,
      operations: ['add', 'subtract', 'multiply'] as Operation[],
      operandRange: [1, 20],
      multiplierRange: [2, 5],
    },
    hard: {
      startRange: [1, 100],
      steps: 4,
      operations: ['add', 'subtract', 'multiply', 'divide'] as Operation[],
      operandRange: [1, 50],
      multiplierRange: [2, 10],
      divisorRange: [2, 5],
    },
  };
  
  return config[difficulty];
};

