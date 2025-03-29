
import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DropZoneProps {
  stepIndex: number;
  isActive: boolean;
  currentOperation: { operation: string; value: number } | null;
  isHighlighted: boolean;
  onDrop: (stepIndex: number, data: { operation: string; value: number }, tileKey: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  stepIndex,
  isActive,
  currentOperation,
  isHighlighted,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Get operation details for display
  const getOperationDisplay = () => {
    if (!currentOperation) return null;
    
    const { operation, value } = currentOperation;
    let symbol = '';
    
    switch (operation) {
      case 'add':
        symbol = '+';
        break;
      case 'subtract':
        symbol = '-';
        break;
      case 'multiply':
        symbol = '×';
        break;
      case 'divide':
        symbol = '÷';
        break;
      default:
        symbol = '';
    }
    
    return { symbol, value };
  };

  const operationDisplay = getOperationDisplay();

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isActive) return;
    
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isActive) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop(stepIndex, data, data.tileKey);
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  return (
    <div
      className={cn(
        "drop-zone flex items-center justify-center rounded-xl p-2 min-w-24 min-h-14 border-2 border-dashed",
        isActive 
          ? "border-primary/70 bg-primary/5" 
          : "border-gray-200 bg-gray-50",
        (isDragOver || isHighlighted) && isActive && "border-primary bg-primary/10",
        currentOperation && "border-solid bg-white"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {currentOperation ? (
        <div className="flex items-center gap-1">
          <span className="font-bold text-xl">
            {operationDisplay?.symbol} {operationDisplay?.value}
          </span>
        </div>
      ) : (
        <div className="flex items-center text-muted-foreground">
          <span className="text-sm">
            {isActive ? "Drop here" : "Wait..."}
          </span>
        </div>
      )}
    </div>
  );
};

export default DropZone;
