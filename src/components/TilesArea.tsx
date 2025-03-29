
import React from 'react';
import OperationTile from './OperationTile';
import { Step } from '@/utils/gameLogic';

interface TilesAreaProps {
  shuffledTiles: Step[];
  tileStates: {[key: string]: { used: boolean, correct: boolean | null }};
  highlightedTile: string | null;
  onDragStart: (operation: string, value: number) => void;
  isMobile: boolean;
}

const TilesArea: React.FC<TilesAreaProps> = ({ 
  shuffledTiles, 
  tileStates, 
  highlightedTile, 
  onDragStart,
  isMobile 
}) => {
  return (
    <>
      <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-center">
          Drag the tiles to solve the puzzle:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {shuffledTiles.map((tile, index) => {
            const tileKey = `${tile.operation}-${tile.value}-${index}`;
            const tileState = tileStates[tileKey] || { used: false, correct: null };
            
            return (
              <OperationTile 
                key={`tile-${index}`}
                tileKey={tileKey}
                operation={tile.operation}
                value={tile.value}
                isUsed={tileState.used}
                isCorrect={tileState.correct}
                isHighlighted={highlightedTile === tileKey}
                onDragStart={onDragStart}
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
      
      {/* User instructions for manual calculation */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>First drag the correct operation, then calculate and type the result in the box.</p>
      </div>
    </>
  );
};

export default TilesArea;
