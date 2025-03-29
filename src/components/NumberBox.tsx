
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NumberBoxProps {
  value: number | string;
  isRevealed: boolean;
  isResult: boolean;
  animate?: boolean;
  editable?: boolean;
  onChange?: (value: number | string) => void;
  onBlur?: () => void;
}

const NumberBox: React.FC<NumberBoxProps> = ({ 
  value, 
  isRevealed, 
  isResult,
  animate = false,
  editable = false,
  onChange,
  onBlur
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (animate && isRevealed && typeof value === 'number') {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value, animate, isRevealed]);

  useEffect(() => {
    if (isRevealed && value !== null && value !== undefined) {
      setInputValue(String(value));
    } else {
      setInputValue('');
    }
  }, [isRevealed, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      const numValue = newValue === '' ? '' : Number(newValue);
      // Only pass valid numbers or empty string
      if (newValue === '' || !isNaN(numValue as number)) {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onBlur) {
      onBlur();
    }
  };

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
      {isRevealed && editable ? (
        <Input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-16 h-12 text-center text-3xl font-bold bg-transparent border-none focus:ring-0 focus:outline-primary"
        />
      ) : (
        <span className="text-3xl font-bold">
          {isRevealed ? value : "?"}
        </span>
      )}
      {isResult && (
        <span className="absolute -top-7 left-0 right-0 text-center text-sm font-semibold text-primary-foreground">
          Final Result
        </span>
      )}
    </div>
  );
};

export default NumberBox;
