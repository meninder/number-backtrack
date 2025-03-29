
// Types for the game
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
  decoyOperations: Step[]; // Added decoy operations
}

// Utility functions for operations
const performOperation = (num: number, operation: Operation, value: number): number => {
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

// Generate decoy operations that are incorrect but plausible
const generateDecoyOperations = (
  correctOperations: Step[], 
  difficulty: Difficulty, 
  count: number
): Step[] => {
  const decoys: Step[] = [];
  const config = getDifficultyConfig(difficulty);
  
  // Generate decoy operations
  for (let i = 0; i < count; i++) {
    const operationTypes: Operation[] = ['add', 'subtract', 'multiply', 'divide'];
    // Filter operations based on difficulty
    const allowedOperations = operationTypes.filter(op => {
      if (difficulty === 'easy') return op === 'add' || op === 'subtract';
      if (difficulty === 'medium') return op !== 'divide' || Math.random() < 0.3;
      return true;
    });
    
    // Pick a random operation type
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
    
    // Generate a value based on operation type
    let value: number;
    switch (operation) {
      case 'add':
      case 'subtract':
        value = Math.floor(Math.random() * (config.operandRange[1] - config.operandRange[0] + 1)) + config.operandRange[0];
        break;
      case 'multiply':
        value = Math.floor(Math.random() * 
          ((config.multiplierRange?.[1] || 5) - (config.multiplierRange?.[0] || 2) + 1)) + 
          (config.multiplierRange?.[0] || 2);
        break;
      case 'divide':
        value = Math.floor(Math.random() * 
          ((config.divisorRange?.[1] || 5) - (config.divisorRange?.[0] || 2) + 1)) + 
          (config.divisorRange?.[0] || 2);
        break;
      default:
        value = 1;
    }
    
    // Make sure the decoy is not identical to any correct operation
    const isDuplicate = correctOperations.some(
      op => op.operation === operation && op.value === value
    );
    
    if (isDuplicate) {
      i--; // Try again
      continue;
    }
    
    decoys.push({ operation, value });
  }
  
  return decoys;
};

// Get configuration based on difficulty
const getDifficultyConfig = (difficulty: Difficulty) => {
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

// Generate a new game based on difficulty
export const generateGame = (difficulty: Difficulty): GameState => {
  const config = getDifficultyConfig(difficulty);

  const { startRange, steps, operations, operandRange } = config;

  // Generate random starting number
  let startNumber = Math.floor(Math.random() * (startRange[1] - startRange[0] + 1)) + startRange[0];
  
  // Generate steps
  const generatedSteps: Step[] = [];
  const intermediateResults: number[] = [startNumber];
  let currentNumber = startNumber;

  for (let i = 0; i < steps; i++) {
    // Pick random operation
    const operationIndex = Math.floor(Math.random() * operations.length);
    const operation = operations[operationIndex];
    
    // Generate appropriate value based on operation
    let value: number;
    
    switch (operation) {
      case 'add':
      case 'subtract':
        value = Math.floor(Math.random() * (operandRange[1] - operandRange[0] + 1)) + operandRange[0];
        break;
      case 'multiply':
        value = Math.floor(Math.random() * 
          ((config.multiplierRange?.[1] || 5) - (config.multiplierRange?.[0] || 2) + 1)) + 
          (config.multiplierRange?.[0] || 2);
        break;
      case 'divide':
        // For division, ensure we get a whole number result
        const divisor = Math.floor(Math.random() * 
          ((config.divisorRange?.[1] || 5) - (config.divisorRange?.[0] || 2) + 1)) + 
          (config.divisorRange?.[0] || 2);
        // Adjust currentNumber to be divisible by divisor
        currentNumber = currentNumber - (currentNumber % divisor);
        // Ensure currentNumber is at least divisor to avoid division by zero
        currentNumber = Math.max(currentNumber, divisor);
        value = divisor;
        break;
      default:
        value = 1;
    }
    
    // Apply operation and update current number
    const nextNumber = performOperation(currentNumber, operation, value);
    
    // Ensure we don't get negative numbers for young kids
    if (nextNumber < 0) {
      i--; // Try again
      continue;
    }
    
    // Ensure division results in whole numbers
    if (operation === 'divide' && nextNumber !== Math.floor(nextNumber)) {
      i--; // Try again
      continue;
    }
    
    generatedSteps.push({ operation, value });
    currentNumber = nextNumber;
    intermediateResults.push(currentNumber);
  }

  // Calculate result
  const result = intermediateResults[intermediateResults.length - 1];
  
  // Generate inverse operations
  const inverseOperations = generatedSteps.map(step => ({
    operation: getInverseOperation(step.operation),
    value: step.value
  }));
  
  // Generate decoy operations (incorrect but plausible options)
  // Add more decoys for higher difficulty levels
  const decoyCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  const decoyOperations = generateDecoyOperations(inverseOperations, difficulty, decoyCount);

  return {
    startNumber,
    steps: generatedSteps,
    result,
    intermediateResults,
    inverseOperations,
    decoyOperations,
  };
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
  game: GameState
): boolean => {
  const correctInverseOp = game.inverseOperations[currentStepIndex];
  return correctInverseOp.operation === operation && correctInverseOp.value === value;
};

// Check if a step is already completed
export const isStepCompleted = (stepIndex: number, completedSteps: number[]): boolean => {
  return completedSteps.includes(stepIndex);
};

// Shuffle an array (for randomizing tile order)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
