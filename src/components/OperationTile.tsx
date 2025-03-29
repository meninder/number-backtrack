
import React, { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface OperationTileProps {
  operation: string;
  value: number;
  isUsed: boolean;
  isCorrect: boolean | null;
  onDragStart: (operation: string, value: number) => void;
}

const OperationTile: React.FC<OperationTileProps> = ({
  operation,
  value,
  isUsed,
  isCorrect,
  onDragStart,
}) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  
  // Set background and text based on operation type
  const getOperationDetails = () => {
    switch (operation) {
      case 'add':
        return { 
          symbol: '+', 
          bg: 'bg-operation-add/90',
          text: 'text-white'
        };
      case 'subtract':
        return { 
          symbol: '-', 
          bg: 'bg-operation-subtract/90',
          text: 'text-white'
        };
      case 'multiply':
        return { 
          symbol: '×', 
          bg: 'bg-operation-multiply/90',
          text: 'text-primary-foreground'
        };
      case 'divide':
        return { 
          symbol: '÷', 
          bg: 'bg-operation-divide/90',
          text: 'text-primary-foreground'
        };
      default:
        return { 
          symbol: '', 
          bg: 'bg-gray-200',
          text: 'text-gray-800'
        };
    }
  };

  const { symbol, bg, text } = getOperationDetails();

  useEffect(() => {
    if (isCorrect !== null) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  // Add drag handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isUsed) return;
    
    if (e.dataTransfer && tileRef.current) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ operation, value }));
      e.dataTransfer.effectAllowed = 'move';
      
      // Create a semi-transparent drag image
      const rect = tileRef.current.getBoundingClientRect();
      const ghostElement = tileRef.current.cloneNode(true) as HTMLElement;
      ghostElement.style.width = `${rect.width}px`;
      ghostElement.style.height = `${rect.height}px`;
      ghostElement.style.opacity = '0.7';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      document.body.appendChild(ghostElement);
      
      e.dataTransfer.setDragImage(ghostElement, rect.width / 2, rect.height / 2);
      
      // Cleanup after a short delay
      setTimeout(() => document.body.removeChild(ghostElement), 0);
      
      onDragStart(operation, value);
    }
  };

  return (
    <div
      ref={tileRef}
      draggable={!isUsed}
      onDragStart={handleDragStart}
      className={cn(
        'operation-tile draggable-tile',
        bg,
        text,
        isUsed && 'opacity-40 cursor-not-allowed',
        isCorrect === true && !animating && 'ring-2 ring-green-500',
        isCorrect === false && !animating && 'ring-2 ring-red-500',
        animating && isCorrect === true && 'correct-animation',
        animating && isCorrect === false && 'incorrect-animation',
      )}
    >
      <span className="text-2xl font-bold">{symbol} {value}</span>
    </div>
  );
};

export default OperationTile;
