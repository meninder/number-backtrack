
import React, { useState, useEffect } from 'react';
import GameHeader from '@/components/GameHeader';
import GameBoard from '@/components/GameBoard';
import { useToast } from '@/components/ui/use-toast';
import { type Difficulty } from '@/utils/gameLogic';

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const { toast } = useToast();

  // Load saved score from localStorage on initial render
  useEffect(() => {
    const savedScore = localStorage.getItem('mathPuzzleScore');
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, []);

  // Save score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mathPuzzleScore', score.toString());
  }, [score]);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty as Difficulty);
    setResetKey(prev => prev + 1);
    
    toast({
      title: "Difficulty Changed",
      description: `Level set to ${newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1)}`,
      duration: 2000,
    });
  };

  // Handle reset game
  const handleResetGame = () => {
    setResetKey(prev => prev + 1);
    
    toast({
      title: "New Puzzle",
      description: "A new math puzzle has been generated!",
      duration: 2000,
    });
  };

  // Handle showing a hint
  const handleShowHint = () => {
    setShowHint(true);
  };

  // Handle hint used (reset hint state)
  const handleHintUsed = () => {
    setShowHint(false);
  };

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;
    setScore(prev => prev + points);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <GameHeader 
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        resetGame={handleResetGame}
        score={score}
        showHint={handleShowHint}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <GameBoard 
          key={resetKey}
          difficulty={difficulty}
          onNewPuzzleComplete={handlePuzzleComplete}
          hintRequested={showHint}
          onHintUsed={handleHintUsed}
        />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Work backwards to find the starting number.
        </p>
      </div>
    </div>
  );
};

export default Index;
