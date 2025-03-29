
import React from 'react';
import DropZone from './DropZone';
import { GameState } from '@/utils/gameLogic';
import { ArrowUp } from 'lucide-react';

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
    <div className="flex justify-center items-center gap-4">
      {game.steps.map((step, index) => (
        <React.Fragment key={`reverse-${index}`}>
          {/* Empty space to align with number boxes */}
          <div className="w-24 opacity-0"></div>
          
          {/* Arrow indicating backward/upward flow */}
          <div className="flex flex-col items-center justify-center w-24 h-14">
            <ArrowUp size={28} className="text-primary" />
          </div>
        </React.Fragment>
      ))}
      
      {/* Empty space to align with final result box */}
      <div className="w-24 opacity-0"></div>
    </div>
  );
};

export default ReverseOperationsArea;
