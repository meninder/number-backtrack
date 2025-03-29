
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
    <div className="flex flex-col w-full max-w-3xl mx-auto mb-8">
      {/* Top row with number boxes and operation displays between them */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {game.steps.map((step, index) => (
          <React.Fragment key={`step-${index}`}>
            {/* Number box (starting value or intermediate value) */}
            <NumberBox 
              value={index === 0 ? (intermediateValues[0] ?? '?') : (intermediateValues[index] ?? '?')}
              isRevealed={intermediateValues[index] !== null}
              isResult={false}
              animate={intermediateValues[index] !== null && index !== 0}
              editable={manualCalculation && intermediateValues[index] === '' && completedSteps.includes(index-1)}
              onChange={(newValue) => handleUserInputChange(index, newValue)}
              onBlur={() => validateUserCalculation(index)}
            />
            
            {/* Operation display between boxes, don't show after the last intermediate value */}
            {index < game.steps.length && (
              <div className="operation-display flex items-center justify-center w-24 h-14 border-2 border-gray-200 rounded-lg bg-white">
                <span className="text-xl font-bold">
                  {step.operation === 'add' && `+${step.value}`}
                  {step.operation === 'subtract' && `-${step.value}`}
                  {step.operation === 'multiply' && `×${step.value}`}
                  {step.operation === 'divide' && `÷${step.value}`}
                </span>
              </div>
            )}
          </React.Fragment>
        ))}
        
        {/* Final result box */}
        <NumberBox 
          value={intermediateValues[intermediateValues.length - 1] ?? '?'}
          isRevealed={intermediateValues[intermediateValues.length - 1] !== null}
          isResult={true}
          animate={false}
        />
      </div>
    </div>
  );
};

export default GamePath;
