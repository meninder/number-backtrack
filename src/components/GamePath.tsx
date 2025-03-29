
import React from 'react';
import NumberBox from './NumberBox';
import OperationArrow from './OperationArrow';
import { GameState } from '@/utils/gameLogic';

interface GamePathProps {
  game: GameState;
  intermediateValues: (number | string | null)[];
  completedSteps: number[];
  manualCalculation: boolean;
  handleUserInputChange: (stepIndex: number, value: number | string) => void;
  validateUserCalculation: (stepIndex: number) => void;
}

const GamePath: React.FC<GamePathProps> = ({ 
  game, 
  intermediateValues, 
  completedSteps,
  manualCalculation,
  handleUserInputChange,
  validateUserCalculation,
}) => {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto mb-2">
      {/* Top row with number boxes and forward arrows */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
        {intermediateValues.map((value, index) => (
          <React.Fragment key={index}>
            <NumberBox 
              value={value ?? '?'} 
              isRevealed={value !== null}
              isResult={index === intermediateValues.length - 1}
              animate={index !== intermediateValues.length - 1}
              editable={manualCalculation && value === '' && completedSteps.includes(index)}
              onChange={(newValue) => handleUserInputChange(index, newValue)}
              onBlur={() => validateUserCalculation(index)}
            />
            
            {index < game.steps.length && (
              <OperationArrow 
                operation={game.steps[index].operation}
                value={game.steps[index].value}
                direction="right"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Vertical connecting arrows */}
      <div className="flex justify-center mb-2">
        {intermediateValues.map((_, index) => (
          <React.Fragment key={`connector-${index}`}>
            <div className="flex-1 flex justify-center">
              <OperationArrow
                operation=""
                value={0}
                direction="down"
              />
            </div>
            {index < intermediateValues.length - 1 && (
              <div className="w-[78px]"></div> // Space for the horizontal arrows
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GamePath;
