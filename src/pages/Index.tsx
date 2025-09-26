import { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection';
import RockPaperScissors from '@/components/RockPaperScissors';
import { Card } from '@/components/ui/card';
import { Gamepad2, Coins } from 'lucide-react';

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(100); // Mock balance

  const handleWalletConnected = (address: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };

  const handleTokenDeducted = () => {
    if (tokenBalance >= 1) {
      setTokenBalance(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="text-center py-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-full flex items-center justify-center animate-glow">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gaming-primary via-gaming-secondary to-gaming-accent bg-clip-text text-transparent">
            Zenchain GameHub
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Blockchain gaming platform with zTTC tokens - Play Rock Paper Scissors on Zenchain Testnet
        </p>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-gaming-primary/10 to-gaming-secondary/10 border-gaming-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gaming-primary/20 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-gaming-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost per game</p>
                <p className="text-2xl font-bold text-gaming-primary">1 zTTC</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-gaming-accent/10 to-gaming-success/10 border-gaming-accent/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-gaming-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Games</p>
                <p className="text-2xl font-bold text-gaming-accent">Rock Paper Scissors</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-gaming-warning/10 to-gaming-secondary/10 border-gaming-warning/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gaming-warning/20 rounded-lg flex items-center justify-center">
                <span className="text-gaming-warning text-lg font-bold">⚡</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-2xl font-bold text-gaming-warning">Zenchain</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Wallet Connection */}
          <div className="space-y-6">
            <WalletConnection 
              onWalletConnected={handleWalletConnected}
              tokenBalance={tokenBalance}
            />
            
            {/* Network Info */}
            <Card className="p-6 bg-gradient-to-br from-muted/50 to-secondary/50 border-muted/50">
              <h3 className="text-lg font-semibold mb-4 text-center">Zenchain Network Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Name:</span>
                  <span>Zenchain Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <span>31337</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Native Currency:</span>
                  <span>ZEN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RPC URL:</span>
                  <span className="text-xs font-mono break-all">zenchain-testnet.api.onfinality.io</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Game Area */}
          <div>
            <RockPaperScissors 
              isWalletConnected={isWalletConnected}
              tokenBalance={tokenBalance}
              onTokenDeducted={handleTokenDeducted}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-16">
        <p className="text-muted-foreground text-sm">
          Built with ❤️ for Zenchain Testnet | 
          <a href="https://zenchain.io" target="_blank" rel="noopener noreferrer" className="text-gaming-primary hover:text-gaming-secondary transition-colors ml-2">
            zenchain.io
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
