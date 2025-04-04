
import React from 'react';
import DropZone from './DropZone';
import { GameState } from '@/utils/gameLogic';
import { ArrowLeft } from 'lucide-react';

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
    <div className="flex flex-col">
      {/* Backward arrow */}
      <div className="relative flex justify-center mb-2">
        <div className="w-[90%] h-px bg-black relative">
          <ArrowLeft className="absolute left-0 top-1/2 -translate-y-1/2 text-black" size={20} />
        </div>
      </div>
      
      {/* Reverse operations area with drop zones */}
      <div className="flex justify-center items-center gap-4">
        {game.steps.map((step, index) => (
          <React.Fragment key={`reverse-${index}`}>
            {/* Empty space to align with number boxes */}
            <div className="w-24 opacity-0"></div>
            
            {/* Drop zone for the reverse operation (aligned with the operation display above) */}
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
          </React.Fragment>
        ))}
        
        {/* Empty space to align with final result box */}
        <div className="w-24 opacity-0"></div>
      </div>
    </div>
  );
};

export default ReverseOperationsArea;
