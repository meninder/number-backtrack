
import { useState, useEffect } from 'react';
import { 
  generateGame, 
  calculateReverseStep, 
  isCorrectReverseStep,
  type Difficulty,
  type Operation,
  type Step,
  type GameState 
} from '@/utils/gameLogic';
import { useToast } from '@/components/ui/use-toast';

export const useGameLogic = (
  difficulty: Difficulty,
  onNewPuzzleComplete: () => void,
  hintRequested: boolean,
  onHintUsed: () => void
) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [intermediateValues, setIntermediateValues] = useState<(number | string | null)[]>([]);
  const [userInputValues, setUserInputValues] = useState<(number | string | null)[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [shuffledTiles, setShuffledTiles] = useState<Step[]>([]);
  const [tileStates, setTileStates] = useState<{[key: string]: { used: boolean, correct: boolean | null } }>({});
  const [currentDragTile, setCurrentDragTile] = useState<{ operation: Operation, value: number } | null>(null);
  const [highlightedTile, setHighlightedTile] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<number | null>(null);
  const [manualCalculation, setManualCalculation] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize or reset the game
  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  // Process hint requests
  useEffect(() => {
    if (hintRequested && game) {
      showHint();
      onHintUsed();
    }
  }, [hintRequested, game, onHintUsed]);

  const initializeGame = () => {
    const newGame = generateGame(difficulty);
    setGame(newGame);
    
    // Initialize intermediate values (all null except the final result)
    const values = Array(newGame.intermediateResults.length).fill(null);
    values[values.length - 1] = newGame.result; // Set the result
    setIntermediateValues(values);
    
    // Initialize user input values
    setUserInputValues(Array(newGame.intermediateResults.length).fill(null));
    
    // Shuffle the inverse operations and decoys for display
    const allTiles = [...newGame.inverseOperations, ...newGame.decoyOperations];
    const shuffled = shuffleArray(allTiles);
    setShuffledTiles(shuffled);
    
    // Initialize tile states
    const initialTileStates: {[key: string]: { used: boolean, correct: boolean | null }} = {};
    shuffled.forEach((tile, index) => {
      const key = `${tile.operation}-${tile.value}-${index}`; // Add index to ensure uniqueness
      initialTileStates[key] = { used: false, correct: null };
    });
    setTileStates(initialTileStates);
    
    // Reset completed steps
    setCompletedSteps([]);
    
    // Set the active drop zone to the last step
    setActiveDropZone(newGame.steps.length - 1);
    
    setHighlightedTile(null);
    setShowCelebration(false);
  };

  // Shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Show a hint
  const showHint = () => {
    if (!game || activeDropZone === null) return;
    
    const correctInverseOp = game.inverseOperations[activeDropZone];
    
    // Find the tile key that matches the correct operation
    let tileKeyToHighlight = null;
    for (const [key, state] of Object.entries(tileStates)) {
      if (!state.used) {
        const [operation, value] = key.split('-');
        if (operation === correctInverseOp.operation && Number(value) === correctInverseOp.value) {
          tileKeyToHighlight = key;
          break;
        }
      }
    }
    
    if (tileKeyToHighlight) {
      // Highlight the correct tile briefly
      setHighlightedTile(tileKeyToHighlight);
      setTimeout(() => setHighlightedTile(null), 2000);
    }
    
    toast({
      title: "Hint",
      description: `Try finding the operation that will work backwards from the last step.`,
      duration: 3000,
    });
  };

  // Handle drag start
  const handleDragStart = (operation: Operation, value: number) => {
    setCurrentDragTile({ operation, value });
  };

  // Handle dropping a tile on a drop zone
  const handleDrop = (stepIndex: number, data: { operation: Operation, value: number }, tileKey: string) => {
    if (!game || stepIndex !== activeDropZone) return;
    
    const { operation, value } = data;
    
    // Check if the dropped tile is correct for this step
    const isCorrect = isCorrectReverseStep(stepIndex, operation, value, game);
    
    // Update tile state
    setTileStates(prev => ({
      ...prev,
      [tileKey]: { used: true, correct: isCorrect }
    }));
    
    if (isCorrect) {
      // Calculate the value for this step
      const currentValue = stepIndex === game.steps.length - 1 
        ? game.result 
        : intermediateValues[stepIndex + 1];
        
      if (currentValue !== null) {
        const newValue = calculateReverseStep(Number(currentValue), operation, value);
        
        if (manualCalculation) {
          // In manual mode, just mark the tile as correct but don't auto-calculate
          toast({
            title: "Correct Operation!",
            description: `Now calculate the result of ${operation} ${value} and enter it in the box.`,
            variant: "default",
          });
          
          // Add step to completed list but don't update the value yet
          setCompletedSteps(prev => [...prev, stepIndex]);
          
          // Enable the input box for user to enter their calculation
          const newIntermediateValues = [...intermediateValues];
          newIntermediateValues[stepIndex] = ''; // Empty string to indicate it's ready for input
          setIntermediateValues(newIntermediateValues);
        } else {
          // Auto-calculation mode (original behavior)
          // Update intermediate values
          const newValues = [...intermediateValues];
          newValues[stepIndex] = newValue;
          setIntermediateValues(newValues);
          
          // Add to completed steps
          setCompletedSteps(prev => [...prev, stepIndex]);
          
          // Update active drop zone
          const nextActive = stepIndex > 0 ? stepIndex - 1 : null;
          setActiveDropZone(nextActive);
          
          // Check if game is completed
          if (stepIndex === 0) {
            handleGameComplete();
          } else {
            toast({
              title: "Correct!",
              description: "Great job! Keep working backwards.",
              variant: "default",
            });
          }
        }
      }
    } else {
      // Wrong tile dropped
      toast({
        title: "Not quite",
        description: "That's not the right operation for this step. Try again!",
        variant: "destructive",
      });
      
      // Reset tile state after a brief delay
      setTimeout(() => {
        setTileStates(prev => ({
          ...prev,
          [tileKey]: { used: false, correct: null }
        }));
      }, 1000);
    }
    
    setCurrentDragTile(null);
  };

  // Handle user input for calculation
  const handleUserInputChange = (stepIndex: number, value: number | string) => {
    const newUserInputValues = [...userInputValues];
    newUserInputValues[stepIndex] = value;
    setUserInputValues(newUserInputValues);
  };

  // Validate user calculation input
  const validateUserCalculation = (stepIndex: number) => {
    if (!game) return;
    
    const userValue = userInputValues[stepIndex];
    
    // If user hasn't entered anything yet
    if (userValue === null || userValue === '') return;
    
    // Get the expected value
    const currentValue = stepIndex === game.steps.length - 1 
      ? game.result 
      : intermediateValues[stepIndex + 1];
      
    if (currentValue === null) return;
    
    // Get the operation that was used
    const correctOp = game.inverseOperations[stepIndex];
    const expectedValue = calculateReverseStep(Number(currentValue), correctOp.operation, correctOp.value);
    
    // Compare user input with expected value
    if (Number(userValue) === expectedValue) {
      // User calculation is correct
      const newValues = [...intermediateValues];
      newValues[stepIndex] = expectedValue;
      setIntermediateValues(newValues);
      
      toast({
        title: "Correct Calculation!",
        description: "Your math is spot on! Keep going.",
        variant: "default",
      });
      
      // Update active drop zone if not at the beginning
      const nextActive = stepIndex > 0 ? stepIndex - 1 : null;
      setActiveDropZone(nextActive);
      
      // Check if game is completed
      if (stepIndex === 0) {
        handleGameComplete();
      }
    } else {
      // User calculation is wrong
      toast({
        title: "Check Your Math",
        description: `That's not the right answer. Try calculating ${correctOp.operation} ${correctOp.value} again.`,
        variant: "destructive",
      });
    }
  };

  // Handle game completion
  const handleGameComplete = () => {
    setShowCelebration(true);
    toast({
      title: "Puzzle Solved!",
      description: `Awesome! You found the starting number: ${game?.startNumber}`,
      variant: "default",
      duration: 5000,
    });
    
    // Notify parent component
    onNewPuzzleComplete();
    
    // Reset celebration effect after a few seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  return {
    game,
    intermediateValues,
    completedSteps,
    shuffledTiles,
    tileStates,
    currentDragTile,
    highlightedTile,
    showCelebration,
    activeDropZone,
    manualCalculation,
    handleDragStart,
    handleDrop,
    handleUserInputChange,
    validateUserCalculation,
    showHint
  };
};
