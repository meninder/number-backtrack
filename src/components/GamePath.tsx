
import React from 'react';
import NumberBox from './NumberBox';
import { GameState } from '@/utils/gameLogic';
import { ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col w-full max-w-3xl mx-auto mb-4">
      {/* Forward operations (top row) */}
      <div className="flex justify-center items-center gap-4 mb-4">
        {game.steps.map((step, index) => (
          <React.Fragment key={`forward-op-${index}`}>
            {/* Empty space where the number box will be */}
            <div className="w-24 h-14 opacity-0"></div>
            
            {/* Forward operation display */}
            <div className="operation-display flex items-center justify-center w-24 h-14 border-2 border-gray-200 rounded-lg bg-white">
              <span className="text-xl font-bold">
                {step.operation === 'add' && `+${step.value}`}
                {step.operation === 'subtract' && `-${step.value}`}
                {step.operation === 'multiply' && `×${step.value}`}
                {step.operation === 'divide' && `÷${step.value}`}
              </span>
            </div>
          </React.Fragment>
        ))}
        
        {/* Empty space at the end */}
        <div className="w-24 h-14 opacity-0"></div>
      </div>
      
      {/* Number boxes (middle row) */}
      <div className="flex justify-center items-center gap-4 mb-4">
        {game.steps.map((step, index) => (
          <React.Fragment key={`number-${index}`}>
            {/* Number box */}
            <NumberBox 
              value={index === 0 ? (intermediateValues[0] ?? '?') : (intermediateValues[index] ?? '?')}
              isRevealed={intermediateValues[index] !== null}
              isResult={false}
              animate={intermediateValues[index] !== null && index !== 0}
              editable={manualCalculation && intermediateValues[index] === '' && completedSteps.includes(index-1)}
              onChange={(newValue) => handleUserInputChange(index, newValue)}
              onBlur={() => validateUserCalculation(index)}
            />
            
            {/* Arrow indicating forward direction */}
            <div className="flex flex-col items-center justify-center w-24">
              <ArrowRight size={28} className="text-primary" />
            </div>
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
