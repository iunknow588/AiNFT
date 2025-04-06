import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">AiNFT</Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/mint" className="hover:text-gray-300">Mint</Link>
            <Link to="/gallery" className="hover:text-gray-300">Gallery</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
