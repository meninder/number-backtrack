
import React from 'react';
import GamePath from './GamePath';
import ReverseOperationsArea from './ReverseOperationsArea';
import TilesArea from './TilesArea';
import CelebrationEffect from './CelebrationEffect';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Difficulty } from '@/utils/gameLogic';

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
  const {
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
    validateUserCalculation
  } = useGameLogic(difficulty, onNewPuzzleComplete, hintRequested, onHintUsed);
  
  const isMobile = useIsMobile();

  // If game is not initialized, show loading
  if (!game) {
    return <div className="flex justify-center">Loading puzzle...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full mb-8">
        {/* Forward calculation path (top row) */}
        <GamePath 
          game={game} 
          intermediateValues={intermediateValues}
          completedSteps={completedSteps}
          manualCalculation={manualCalculation}
          handleUserInputChange={handleUserInputChange}
          validateUserCalculation={validateUserCalculation}
        />
        
        {/* Reverse calculation path with drop zones (bottom row) */}
        <ReverseOperationsArea 
          game={game}
          activeDropZone={activeDropZone}
          completedSteps={completedSteps}
          currentDragTile={currentDragTile}
          onDrop={handleDrop}
        />
      </div>
      
      {/* Available operation tiles */}
      <TilesArea 
        shuffledTiles={shuffledTiles}
        tileStates={tileStates}
        highlightedTile={highlightedTile}
        onDragStart={handleDragStart}
        isMobile={isMobile}
      />
      
      {/* Celebration effect when the game is completed */}
      {showCelebration && <CelebrationEffect />}
    </div>
  );
};

export default GameBoard;
