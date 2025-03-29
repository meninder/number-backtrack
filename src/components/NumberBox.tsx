
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface NumberBoxProps {
  value: number | string;
  isRevealed: boolean;
  isResult: boolean;
  animate?: boolean;
}

const NumberBox: React.FC<NumberBoxProps> = ({ 
  value, 
  isRevealed, 
  isResult,
  animate = false 
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  useEffect(() => {
    if (animate && isRevealed && typeof value === 'number') {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value, animate, isRevealed]);

  return (
    <div
      className={cn(
        "relative w-24 h-24 flex items-center justify-center rounded-2xl shadow-md border-2",
        isResult 
          ? "bg-primary text-white border-primary" 
          : "bg-white border-gray-200",
        shouldAnimate && "box-reveal"
      )}
    >
      <span className="text-3xl font-bold">
        {isRevealed ? value : "?"}
      </span>
      {isResult && (
        <span className="absolute -top-7 left-0 right-0 text-center text-sm font-semibold text-primary-foreground">
          Final Result
        </span>
      )}
      {!isRevealed && !isResult && (
        <span className="absolute -top-7 left-0 right-0 text-center text-sm font-semibold text-muted-foreground">
          Starting Number
        </span>
      )}
    </div>
  );
};

export default NumberBox;
