
import { Operation } from './types';

// Utility functions for operations
export const performOperation = (num: number, operation: Operation, value: number): number => {
  switch (operation) {
    case 'add':
      return num + value;
    case 'subtract':
      return num - value;
    case 'multiply':
      return num * value;
    case 'divide':
      return num / value;
    default:
      return num;
  }
};

// Get the inverse of an operation
export const getInverseOperation = (operation: Operation): Operation => {
  switch (operation) {
    case 'add':
      return 'subtract';
    case 'subtract':
      return 'add';
    case 'multiply':
      return 'divide';
    case 'divide':
      return 'multiply';
    default:
      return operation;
  }
};

// Calculate a step in reverse
export const calculateReverseStep = (currentNumber: number, operation: Operation, value: number): number => {
  return performOperation(currentNumber, operation, value);
};

// Validate if a reverse step is correct
export const isCorrectReverseStep = (
  currentStepIndex: number,
  operation: Operation,
  value: number,
  game: import('./types').GameState
): boolean => {
  const correctInverseOp = game.inverseOperations[currentStepIndex];
  return correctInverseOp.operation === operation && correctInverseOp.value === value;
};

// Check if a step is already completed
export const isStepCompleted = (stepIndex: number, completedSteps: number[]): boolean => {
  return completedSteps.includes(stepIndex);
};
