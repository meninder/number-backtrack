
import React from 'react';
import { ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface OperationArrowProps {
  operation: string;
  value: number;
  direction?: 'right' | 'up' | 'down';
}

const OperationArrow: React.FC<OperationArrowProps> = ({ 
  operation, 
  value, 
  direction = 'right' 
}) => {
  let displayText = '';
  
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
    default:
      displayText = '';
  }

  return (
    <div className="flex flex-col items-center justify-center px-2">
      <div className="text-sm font-semibold mb-1 text-muted-foreground">
        {displayText}
      </div>
      {direction === 'right' && (
        <ArrowRight size={28} className="text-primary" />
      )}
      {direction === 'up' && (
        <ArrowUp size={28} className="text-primary" />
      )}
      {direction === 'down' && (
        <ArrowDown size={28} className="text-primary" />
      )}
    </div>
  );
};

export default OperationArrow;
