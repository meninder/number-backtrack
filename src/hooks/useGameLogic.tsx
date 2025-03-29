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

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (hintRequested && game) {
      showHint();
      onHintUsed();
    }
  }, [hintRequested, game, onHintUsed]);

  const initializeGame = () => {
    const newGame = generateGame(difficulty);
    setGame(newGame);
    
    const values = Array(newGame.intermediateResults.length).fill(null);
    values[values.length - 1] = newGame.result;
    setIntermediateValues(values);
    
    setUserInputValues(Array(newGame.intermediateResults.length).fill(null));
    
    const allTiles = [...newGame.inverseOperations, ...newGame.decoyOperations];
    const shuffled = shuffleArray(allTiles);
    setShuffledTiles(shuffled);
    
    const initialTileStates: {[key: string]: { used: boolean, correct: boolean | null }} = {};
    shuffled.forEach((tile, index) => {
      const key = `${tile.operation}-${tile.value}-${index}`;
      initialTileStates[key] = { used: false, correct: null };
    });
    setTileStates(initialTileStates);
    
    setCompletedSteps([]);
    
    setActiveDropZone(newGame.steps.length - 1);
    
    setHighlightedTile(null);
    setShowCelebration(false);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const showHint = () => {
    if (!game || activeDropZone === null) return;
    
    const correctInverseOp = game.inverseOperations[activeDropZone];
    
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
      setHighlightedTile(tileKeyToHighlight);
      setTimeout(() => setHighlightedTile(null), 2000);
    }
    
    toast({
      title: "Hint",
      description: `Try finding the operation that will work backwards from the last step.`,
      duration: 3000,
    });
  };

  const handleDragStart = (operation: Operation, value: number) => {
    setCurrentDragTile({ operation, value });
  };

  const handleDrop = (stepIndex: number, data: { operation: Operation, value: number }, tileKey: string) => {
    if (!game || stepIndex !== activeDropZone) return;
    
    const { operation, value } = data;
    
    const isCorrect = isCorrectReverseStep(stepIndex, operation, value, game);
    
    setTileStates(prev => ({
      ...prev,
      [tileKey]: { used: true, correct: isCorrect }
    }));
    
    if (isCorrect) {
      const currentValue = stepIndex === game.steps.length - 1 
        ? game.result 
        : intermediateValues[stepIndex + 1];
        
      if (currentValue !== null) {
        setCompletedSteps(prev => [...prev, stepIndex]);
        
        if (manualCalculation) {
          const newIntermediateValues = [...intermediateValues];
          newIntermediateValues[stepIndex] = '';
          setIntermediateValues(newIntermediateValues);
          
          toast({
            title: "Correct Operation!",
            description: `Now calculate the result of ${operation} ${value} and enter it in the box.`,
            variant: "default",
          });
        } else {
          const newValue = calculateReverseStep(Number(currentValue), operation, value);
          
          const newValues = [...intermediateValues];
          newValues[stepIndex] = newValue;
          setIntermediateValues(newValues);
          
          const nextActive = stepIndex > 0 ? stepIndex - 1 : null;
          setActiveDropZone(nextActive);
          
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
      toast({
        title: "Not quite",
        description: "That's not the right operation for this step. Try again!",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setTileStates(prev => ({
          ...prev,
          [tileKey]: { used: false, correct: null }
        }));
      }, 1000);
    }
    
    setCurrentDragTile(null);
  };

  const handleUserInputChange = (stepIndex: number, value: number | string) => {
    const newUserInputValues = [...userInputValues];
    newUserInputValues[stepIndex] = value;
    setUserInputValues(newUserInputValues);
  };

  const validateUserCalculation = (stepIndex: number) => {
    if (!game) return;
    
    const userValue = userInputValues[stepIndex];
    
    if (userValue === null || userValue === '') return;
    
    const currentValue = stepIndex === game.steps.length - 1 
      ? game.result 
      : intermediateValues[stepIndex + 1];
      
    if (currentValue === null) return;
    
    const correctOp = game.inverseOperations[stepIndex];
    const expectedValue = calculateReverseStep(Number(currentValue), correctOp.operation, correctOp.value);
    
    if (Number(userValue) === expectedValue) {
      const newValues = [...intermediateValues];
      newValues[stepIndex] = expectedValue;
      setIntermediateValues(newValues);
      
      toast({
        title: "Correct Calculation!",
        description: "Your math is spot on! Keep going.",
        variant: "default",
      });
      
      const nextActive = stepIndex > 0 ? stepIndex - 1 : null;
      setActiveDropZone(nextActive);
      
      if (stepIndex === 0) {
        handleGameComplete();
      }
    } else {
      toast({
        title: "Check Your Math",
        description: `That's not the right answer. Try calculating ${correctOp.operation} ${correctOp.value} again.`,
        variant: "destructive",
      });
    }
  };

  const handleGameComplete = () => {
    setShowCelebration(true);
    toast({
      title: "Puzzle Solved!",
      description: `Awesome! You found the starting number: ${game?.startNumber}`,
      variant: "default",
      duration: 5000,
    });
    
    onNewPuzzleComplete();
    
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
