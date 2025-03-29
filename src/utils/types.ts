
// Type definitions for the game

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Step {
  operation: Operation;
  value: number;
}

export interface GameState {
  startNumber: number;
  steps: Step[];
  result: number;
  intermediateResults: number[];
  inverseOperations: Step[];
  decoyOperations: Step[]; // Decoy operations
}

