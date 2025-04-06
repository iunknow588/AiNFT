import type { FC } from 'react';
import { Coins } from 'lucide-react';

const Header: FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold">NFTFlow</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition">Platform</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Docs</a>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
              Connect Wallet
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
