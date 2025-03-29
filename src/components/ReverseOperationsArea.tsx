
import React from 'react';
import DropZone from './DropZone';
import OperationArrow from './OperationArrow';
import { GameState } from '@/utils/gameLogic';

interface ReverseOperationsAreaProps {
  game: GameState;
  activeDropZone: number | null;
  completedSteps: number[];
  currentDragTile: { operation: string; value: number } | null;
  onDrop: (stepIndex: number, data: { operation: string; value: number }, tileKey: string) => void;
}

const ReverseOperationsArea: React.FC<ReverseOperationsAreaProps> = ({ 
  game, 
  activeDropZone, 
  completedSteps, 
  currentDragTile,
  onDrop 
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
      {game.steps.map((_, index) => {
        // Calculate position to align with number boxes
        const boxIndex = index;
        
        return (
          <div key={`reverse-${index}`} className="flex flex-col items-center">
            {/* Upward arrow indicating the backward operation */}
            <div className="mb-1">
              <OperationArrow 
                operation="backwards" 
                value={0} 
              />
            </div>
            
            {/* Drop zone for the backward operation */}
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
              onDrop={onDrop}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ReverseOperationsArea;
