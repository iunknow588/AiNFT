export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © 2024 ElizaOS NFT. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/elizaos/eliza" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <a 
              href="/docs" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}