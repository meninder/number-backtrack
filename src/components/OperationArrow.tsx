
import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OperationArrowProps {
  operation: string;
  value: number;
}

const OperationArrow: React.FC<OperationArrowProps> = ({ operation, value }) => {
  let displayText = '';
  let isBackwards = false;
  
  switch (operation) {
    case 'add':
      displayText = `+ ${value}`;
      break;
    case 'subtract':
      displayText = `- ${value}`;
      break;
    case 'multiply':
      displayText = `× ${value}`;
      break;
    case 'divide':
      displayText = `÷ ${value}`;
      break;
    case 'backwards':
      isBackwards = true;
      displayText = '';
      break;
    default:
      displayText = '';
  }

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <div className="text-sm font-semibold mb-1 text-muted-foreground">
        {displayText}
      </div>
      {isBackwards ? (
        <ArrowLeft size={28} className="text-primary" />
      ) : (
        <ArrowRight size={28} className="text-primary" />
      )}
    </div>
  );
};

export default OperationArrow;
