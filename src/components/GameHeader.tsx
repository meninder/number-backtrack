
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GameHeaderProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
  resetGame: () => void;
  score: number;
  showHint: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  difficulty,
  setDifficulty,
  resetGame,
  score,
  showHint
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Math Path Reverser</h1>
        <p className="text-muted-foreground mt-1">
          Work backwards to find the starting number!
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Level:</span>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={showHint}>
            Hint
          </Button>
          <Button onClick={resetGame}>
            New Puzzle
          </Button>
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-3 text-center min-w-20">
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="text-2xl font-bold text-primary">{score}</p>
      </div>
    </div>
  );
};

export default GameHeader;
