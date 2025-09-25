import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  onWalletConnected: (address: string) => void;
  tokenBalance: number;
}

const WalletConnection = ({ onWalletConnected, tokenBalance }: WalletConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "خطا",
        description: "لطفا کیف پول MetaMask را نصب کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      onWalletConnected(address);
      
      toast({
        title: "اتصال موفق",
        description: "کیف پول شما با موفقیت متصل شد",
      });
      
      // Add Zenchain testnet
      await addZenchainNetwork();
      
    } catch (error) {
      console.error('خطا در اتصال کیف پول:', error);
      toast({
        title: "خطا در اتصال",
        description: "مشکلی در اتصال کیف پول رخ داد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addZenchainNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69', // Zenchain testnet chain ID
          chainName: 'Zenchain Testnet',
          nativeCurrency: {
            name: 'ZEN',
            symbol: 'ZEN',
            decimals: 18
          },
          rpcUrls: ['https://zenchain-testnet.api.onfinality.io/public'],
          blockExplorerUrls: ['https://explorer.zenchain.io']
        }]
      });
    } catch (error) {
      console.error('خطا در افزودن شبکه:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    toast({
      title: "قطع اتصال",
      description: "کیف پول شما قطع شد",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <Card className="p-6 bg-gradient-to-br from-card via-card to-muted border-gaming-primary/20 shadow-card">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-full flex items-center justify-center animate-glow">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent">
            کیف پول
          </h2>
          
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                برای شروع بازی کیف پول خود را متصل کنید
              </p>
              <Button
                variant="wallet"
                size="lg"
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full"
              >
                <Wallet className="ml-2 h-5 w-5" />
                {isLoading ? 'در حال اتصال...' : 'اتصال کیف پول'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">آدرس کیف پول:</p>
                <p className="font-mono text-sm">{formatAddress(walletAddress)}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-gaming-accent/10 to-gaming-success/10 rounded-lg border border-gaming-accent/30">
                <p className="text-sm text-muted-foreground mb-1">موجودی zTTC:</p>
                <p className="text-2xl font-bold text-gaming-accent">{tokenBalance.toFixed(2)}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="flex-1"
                >
                  قطع اتصال
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => window.open('https://explorer.zenchain.io', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default WalletConnection;