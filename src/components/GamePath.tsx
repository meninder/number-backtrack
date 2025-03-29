
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
    <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
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
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GamePath;
