#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查目录是否存在
check_directory() {
    if [ ! -d "$1" ]; then
        log_error "Directory $1 does not exist!"
        exit 1
    fi
}

# 检查文件是否已存在且有内容
check_file_exists() {
    local file=$1
    if [ -f "$file" ] && [ -s "$file" ]; then
        return 0 # 文件存在且非空
    fi
    return 1 # 文件不存在或为空
}

# 安全复制文件
safe_copy() {
    local src=$1
    local dst=$2
    local force=${3:-false}

    if [ ! -f "$src" ]; then
        log_warn "Source file not found: $src"
        return 1
    fi

    if [ "$force" = "true" ] || ! check_file_exists "$dst"; then
        mkdir -p "$(dirname "$dst")"
        cp "$src" "$dst"
        log_info "Copied: $src -> $dst"
    else
        log_warn "Skipped existing file: $dst"
    fi
}

# 安全复制目录
safe_copy_directory() {
    local src=$1
    local dst=$2
    local force=${3:-false}

    if [ ! -d "$src" ]; then
        log_warn "Source directory not found: $src"
        return 1
    fi

    if [ "$force" = "true" ] || [ ! -d "$dst" ] || [ -z "$(ls -A "$dst" 2>/dev/null)" ]; then
        mkdir -p "$dst"
        cp -r "$src/"* "$dst/" 2>/dev/null || true
        log_info "Copied directory: $src -> $dst"
    else
        log_warn "Skipped existing directory: $dst"
    fi
}

# 主要迁移函数
migrate_ui() {
    local SOURCE_DIR="deps/eliza/client"
    local TARGET_DIR="client"
    local MIGRATION_MARKER="$TARGET_DIR/.migration_completed"

    # 检查源目录
    check_directory "$SOURCE_DIR"

    # 检查是否已经完成迁移
    if [ -f "$MIGRATION_MARKER" ]; then
        log_warn "Migration has already been completed. Use --force to override."
        read -p "Do you want to force migration? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Migration cancelled."
            exit 0
        fi
        FORCE=true
    else
        FORCE=false
    fi

    # 创建新的客户端目录结构
    log_info "Creating client directory structure..."
    mkdir -p "$TARGET_DIR"/{src/{components/{layout,pages,ui,sections},lib,hooks,styles,assets,contexts,types},public}

    # 复制基础文件
    log_info "Copying base files..."
    safe_copy "$SOURCE_DIR/package.json" "$TARGET_DIR/package.json" "$FORCE"
    safe_copy "$SOURCE_DIR/vite.config.ts" "$TARGET_DIR/vite.config.ts" "$FORCE"
    safe_copy "$SOURCE_DIR/tsconfig.json" "$TARGET_DIR/tsconfig.json" "$FORCE"
    safe_copy "$SOURCE_DIR/index.html" "$TARGET_DIR/index.html" "$FORCE"
    safe_copy "$SOURCE_DIR/.env" "$TARGET_DIR/.env" "$FORCE"
    safe_copy "$SOURCE_DIR/.env.example" "$TARGET_DIR/.env.example" "$FORCE"

    # 复制目录结构
    log_info "Copying directory structure..."
    safe_copy_directory "$SOURCE_DIR/public" "$TARGET_DIR/public" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/components" "$TARGET_DIR/src/components" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/lib" "$TARGET_DIR/src/lib" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/hooks" "$TARGET_DIR/src/hooks" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/styles" "$TARGET_DIR/src/styles" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/assets" "$TARGET_DIR/src/assets" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/contexts" "$TARGET_DIR/src/contexts" "$FORCE"
    safe_copy_directory "$SOURCE_DIR/src/types" "$TARGET_DIR/src/types" "$FORCE"

    # 检查并创建必要的配置文件
    if [ "$FORCE" = "true" ] || ! check_file_exists "$TARGET_DIR/tailwind.config.js" ]; then
        log_info "Creating Tailwind configuration..."
        cat > "$TARGET_DIR/tailwind.config.js" << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL
    fi

    if [ "$FORCE" = "true" ] || ! check_file_exists "$TARGET_DIR/tsconfig.node.json" ]; then
        log_info "Creating TypeScript node configuration..."
        cat > "$TARGET_DIR/tsconfig.node.json" << 'EOL'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntaxOnly": true
  },
  "include": ["vite.config.ts"]
}
EOL
    fi

    # 检查并创建样式文件
    if [ "$FORCE" = "true" ] || ! check_file_exists "$TARGET_DIR/src/styles/index.css" ]; then
        log_info "Creating base styles..."
        mkdir -p "$TARGET_DIR/src/styles"
        cat > "$TARGET_DIR/src/styles/index.css" << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL
    fi

    # 更新依赖
    if [ "$FORCE" = "true" ] || ! check_file_exists "$TARGET_DIR/node_modules" ]; then
        log_info "Installing dependencies..."
        cd "$TARGET_DIR"
        pnpm add react react-dom react-router-dom @web3-react/core @web3-react/metamask
        pnpm add -D typescript @types/react @types/react-dom @types/node
        pnpm add -D tailwindcss postcss autoprefixer
        pnpm add -D @vitejs/plugin-react vite
        cd ..
    fi

    # 创建迁移标记文件
    touch "$MIGRATION_MARKER"
    log_info "Migration completed successfully!"
}

# 检查布局文件
check_layout_files() {
    local layout_dir="client/src/components/layout"
    local force=${1:-false}

    if [ "$force" = "true" ] || ! check_file_exists "$layout_dir/Header.tsx" ]; then
        log_info "Creating Header component..."
        mkdir -p "$layout_dir"
        cat > "$layout_dir/Header.tsx" << 'EOL'
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
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
EOL
    fi

    if [ "$force" = "true" ] || ! check_file_exists "$layout_dir/Footer.tsx" ]; then
        log_info "Creating Footer component..."
        mkdir -p "$layout_dir"
        cat > "$layout_dir/Footer.tsx" << 'EOL'
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4">
        <p className="text-center">&copy; {new Date().getFullYear()} AiNFT. All rights reserved.</p>
      </div>
    </footer>
  );
};
EOL
    fi

    if [ "$force" = "true" ] || ! check_file_exists "$layout_dir/Layout.tsx" ]; then
        log_info "Creating Layout component..."
        mkdir -p "$layout_dir"
        cat > "$layout_dir/Layout.tsx" << 'EOL'
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
EOL
    fi
}

# 解析命令行参数
FORCE=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --force) FORCE=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# 执行迁移
migrate_ui
check_layout_files "$FORCE"

# 提示后续步骤
echo -e "\n${GREEN}Next steps:${NC}"
echo "1. cd client"
echo "2. pnpm install (if not already done)"
echo "3. pnpm dev"
echo -e "\n${YELLOW}Note:${NC} Please check all import paths and update them if necessary."




# 删除新的 client 目录
# rm -rf client
# 恢复备份
# mv client_backup_* client
