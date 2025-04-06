import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Button } from "../ui/button";

export default function Navbar() {
  const { account, connector, activate } = useWeb3React();

  const connectWallet = async () => {
    try {
      await activate(connector);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            ElizaOS NFT
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/nft/create" className="text-muted-foreground hover:text-foreground">
              Create NFT
            </Link>
            <Link to="/gallery" className="text-muted-foreground hover:text-foreground">
              Gallery
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </Link>
            
            {!account ? (
              <Button onClick={connectWallet} variant="outline">
                Connect Wallet
              </Button>
            ) : (
              <Button variant="outline">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}