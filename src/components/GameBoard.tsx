
import React, { useState, useEffect } from 'react';
import NumberBox from './NumberBox';
import OperationArrow from './OperationArrow';
import OperationTile from './OperationTile';
import DropZone from './DropZone';
import CelebrationEffect from './CelebrationEffect';
import { 
  generateGame, 
  calculateReverseStep, 
  isCorrectReverseStep,
  shuffleArray,
  type Difficulty,
  type Operation,
  type Step,
  type GameState
} from '@/utils/gameLogic';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameBoardProps {
  difficulty: Difficulty;
  onNewPuzzleComplete: () => void;
  hintRequested: boolean;
  onHintUsed: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  difficulty, 
  onNewPuzzleComplete,
  hintRequested,
  onHintUsed
}) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [intermediateValues, setIntermediateValues] = useState<(number | null)[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [shuffledTiles, setShuffledTiles] = useState<Step[]>([]);
  const [tileStates, setTileStates] = useState<{[key: string]: { used: boolean, correct: boolean | null } }>({});
  const [currentDragTile, setCurrentDragTile] = useState<{ operation: Operation, value: number } | null>(null);
  const [highlightedTile, setHighlightedTile] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<number | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
  }, [hintRequested]);

  const initializeGame = () => {
    const newGame = generateGame(difficulty);
    setGame(newGame);
    
    // Initialize intermediate values (all null except the final result)
    const values = Array(newGame.intermediateResults.length).fill(null);
    values[values.length - 1] = newGame.result; // Set the result
    setIntermediateValues(values);
    
    // Shuffle the inverse operations for display
    const shuffled = shuffleArray([...newGame.inverseOperations]);
    setShuffledTiles(shuffled);
    
    // Initialize tile states
    const initialTileStates: {[key: string]: { used: boolean, correct: boolean | null }} = {};
    shuffled.forEach(tile => {
      const key = `${tile.operation}-${tile.value}`;
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

  // Calculate the next active drop zone
  const getNextActiveStep = () => {
    if (!game) return null;
    
    const stepCount = game.steps.length;
    // Start from the last step and go backwards
    for (let i = stepCount - 1; i >= 0; i--) {
      if (!completedSteps.includes(i)) {
        return i;
      }
    }
    
    return null; // All steps completed
  };

  // Show a hint
  const showHint = () => {
    if (!game || activeDropZone === null) return;
    
    const correctInverseOp = game.inverseOperations[activeDropZone];
    const tileKey = `${correctInverseOp.operation}-${correctInverseOp.value}`;
    
    // Highlight the correct tile briefly
    setHighlightedTile(tileKey);
    setTimeout(() => setHighlightedTile(null), 2000);
    
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
  const handleDrop = (stepIndex: number, data: { operation: Operation, value: number }) => {
    if (!game || stepIndex !== activeDropZone) return;
    
    const { operation, value } = data;
    const tileKey = `${operation}-${value}`;
    
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
        const newValue = calculateReverseStep(currentValue, operation, value);
        
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

  // If game is not initialized, show loading
  if (!game) {
    return <div className="flex justify-center">Loading puzzle...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* Game path visualization */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
        {intermediateValues.map((value, index) => (
          <React.Fragment key={index}>
            <NumberBox 
              value={value ?? '?'} 
              isRevealed={value !== null}
              isResult={index === intermediateValues.length - 1}
              animate={index !== intermediateValues.length - 1}
            />
            
            {index < game.steps.length && (
              <OperationArrow 
                operation={game.steps[index].operation}
                value={game.steps[index].value}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Drop zones for inverse operations */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
        {game.steps.map((_, index) => (
          <div key={`reverse-${index}`} className="flex items-center">
            {index > 0 && (
              <div className="mx-2">
                <OperationArrow 
                  operation="add" 
                  value={0} 
                />
              </div>
            )}
            
            <DropZone 
              stepIndex={index}
              isActive={activeDropZone === index}
              currentOperation={
                completedSteps.includes(index) 
                  ? { 
                      operation: game.inverseOperations[index].operation, 
                      value: game.inverseOperations[index].value 
                    }
                  : null
              }
              isHighlighted={activeDropZone === index && currentDragTile !== null}
              onDrop={handleDrop}
            />
          </div>
        ))}
      </div>
      
      {/* Available operation tiles */}
      <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-center">
          Drag the tiles to solve the puzzle:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {shuffledTiles.map((tile, index) => {
            const tileKey = `${tile.operation}-${tile.value}`;
            const tileState = tileStates[tileKey] || { used: false, correct: null };
            
            return (
              <OperationTile 
                key={`tile-${index}`}
                operation={tile.operation}
                value={tile.value}
                isUsed={tileState.used}
                isCorrect={tileState.correct}
                onDragStart={handleDragStart}
              />
            );
          })}
        </div>
      </div>
      
      {/* Touch device instructions */}
      {isMobile && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Tap and hold a tile, then drag it to the correct position.</p>
        </div>
      )}
      
      {/* Celebration effect when the game is completed */}
      {showCelebration && <CelebrationEffect />}
    </div>
  );
};

export default GameBoard;
