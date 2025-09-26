import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scissors, FileText, Zap, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type GameChoice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw';

interface RockPaperScissorsProps {
  isWalletConnected: boolean;
  tokenBalance: number;
  onTokenDeducted: () => void;
}

const RockPaperScissors = ({ isWalletConnected, tokenBalance, onTokenDeducted }: RockPaperScissorsProps) => {
  const [playerChoice, setPlayerChoice] = useState<GameChoice | null>(null);
  const [computerChoice, setComputerChoice] = useState<GameChoice | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0, draws: 0 });

  const choices: { id: GameChoice; name: string; icon: React.ReactNode; emoji: string }[] = [
    { id: 'rock', name: 'Rock', icon: <Zap className="w-8 h-8" />, emoji: '🗿' },
    { id: 'paper', name: 'Paper', icon: <FileText className="w-8 h-8" />, emoji: '📄' },
    { id: 'scissors', name: 'Scissors', icon: <Scissors className="w-8 h-8" />, emoji: '✂️' },
  ];

  const getRandomChoice = (): GameChoice => {
    const choices: GameChoice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: GameChoice, computer: GameChoice): GameResult => {
    if (player === computer) return 'draw';
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[player] === computer ? 'win' : 'lose';
  };

  const playGame = async (choice: GameChoice) => {
    if (!isWalletConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (tokenBalance < 1) {
      toast({
        title: "Insufficient Balance",
        description: "You need 1 zTTC token to play",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Simulate token deduction
    onTokenDeducted();
    
    // Add delay for dramatic effect
    setTimeout(() => {
      const computerMove = getRandomChoice();
      setComputerChoice(computerMove);
      
      const result = determineWinner(choice, computerMove);
      setGameResult(result);
      
      // Update stats
      setGameStats(prev => ({
        ...prev,
        [result === 'win' ? 'wins' : result === 'lose' ? 'losses' : 'draws']: 
          prev[result === 'win' ? 'wins' : result === 'lose' ? 'losses' : 'draws'] + 1
      }));
      
      // Show result toast
      const messages = {
        win: 'Congratulations! You won! 🎉',
        lose: 'Sorry, you lost! 😔',
        draw: 'It\'s a draw! Try again 🤝'
      };
      
      toast({
        title: messages[result],
        description: `You: ${choices.find(c => c.id === choice)?.name} - Computer: ${choices.find(c => c.id === computerMove)?.name}`,
      });
      
      setIsPlaying(false);
    }, 2000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameResult(null);
  };

  const getChoiceDisplay = (choice: GameChoice | null) => {
    if (!choice) return '❓';
    return choices.find(c => c.id === choice)?.emoji || '❓';
  };

  const getResultColor = (result: GameResult | null) => {
    switch (result) {
      case 'win': return 'text-gaming-success';
      case 'lose': return 'text-destructive';
      case 'draw': return 'text-gaming-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getResultText = (result: GameResult | null) => {
    switch (result) {
      case 'win': return 'Winner! 🎉';
      case 'lose': return 'Lost 😔';
      case 'draw': return 'Draw 🤝';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game Header */}
      <Card className="p-6 bg-gradient-to-br from-card via-card to-muted border-gaming-primary/20 shadow-card">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent">
            Rock Paper Scissors
          </h2>
          <p className="text-muted-foreground">
            Each game costs 1 zTTC token
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-4 text-sm">
            <div className="px-3 py-1 bg-gaming-success/20 rounded-full">
              <span className="text-gaming-success">Wins: {gameStats.wins}</span>
            </div>
            <div className="px-3 py-1 bg-destructive/20 rounded-full">
              <span className="text-destructive">Losses: {gameStats.losses}</span>
            </div>
            <div className="px-3 py-1 bg-gaming-warning/20 rounded-full">
              <span className="text-gaming-warning">Draws: {gameStats.draws}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Board */}
      <Card className="p-8 bg-gradient-to-br from-card via-card to-muted border-gaming-primary/20 shadow-card">
        <div className="space-y-8">
          {/* Battle Area */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">You</p>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20 rounded-full flex items-center justify-center text-4xl border-2 border-gaming-primary/30">
                {getChoiceDisplay(playerChoice)}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${getResultColor(gameResult)}`}>
                {isPlaying ? '⚡' : gameResult ? getResultText(gameResult) : 'VS'}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Computer</p>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-muted/20 to-secondary/20 rounded-full flex items-center justify-center text-4xl border-2 border-muted/30">
                {isPlaying ? '🤔' : getChoiceDisplay(computerChoice)}
              </div>
            </div>
          </div>

          {/* Choice Buttons */}
          <div className="grid grid-cols-3 gap-4">
            {choices.map((choice) => (
              <Button
                key={choice.id}
                variant="gaming"
                size="lg"
                onClick={() => playGame(choice.id)}
                disabled={isPlaying || !isWalletConnected}
                className="h-24 flex-col gap-2 text-lg"
              >
                <div className="text-2xl">{choice.emoji}</div>
                <span>{choice.name}</span>
              </Button>
            ))}
          </div>

          {/* Reset Button */}
          {(playerChoice || computerChoice) && !isPlaying && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={resetGame}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </Button>
            </div>
          )}

          {/* Wallet Warning */}
          {!isWalletConnected && (
            <div className="text-center p-4 bg-gaming-warning/10 border border-gaming-warning/30 rounded-lg">
              <p className="text-gaming-warning">
                To start playing, connect your wallet
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RockPaperScissors;