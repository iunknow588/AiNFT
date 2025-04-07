#!/bin/bash

# 定义源目录和目标目录
SOURCE_DIR="/home/lc/AiNFT/AiNFT/client/src"
ELIZA_DIR="/home/lc/AiNFT/AiNFT/deps/eliza/client/src"

# 日志函数
log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[0;33m[WARN]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

# 检查目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    log_error "Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

if [ ! -d "$ELIZA_DIR" ]; then
    log_error "Eliza directory does not exist: $ELIZA_DIR"
    exit 1
fi

# 创建临时目录用于备份
BACKUP_DIR="${ELIZA_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
log_info "Creating backup at: $BACKUP_DIR"
cp -r "$ELIZA_DIR" "$BACKUP_DIR"

# 获取源目录的文件列表
SOURCE_FILES=$(cd "$SOURCE_DIR" && find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json")

# 清理 Eliza 目录中不需要的文件
log_info "Cleaning unnecessary files from Eliza directory..."
cd "$ELIZA_DIR" || exit 1

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" \) | while read -r file; do
    # 检查文件是否在源目录中存在
    if [ ! -f "${SOURCE_DIR}/${file}" ]; then
        log_warn "Removing: $file"
        rm "$file"
        
        # 如果父目录为空，则删除父目录
        dir=$(dirname "$file")
        while [ "$dir" != "." ] && [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ]; do
            rmdir "$dir"
            log_info "Removed empty directory: $dir"
            dir=$(dirname "$dir")
        done
    fi
done

# 删除空目录
find . -type d -empty -delete

log_success "Cleanup completed!"
log_info "Backup created at: $BACKUP_DIR"
log_info "You can restore the backup using:"
echo "rm -rf \"$ELIZA_DIR\" && mv \"$BACKUP_DIR\" \"$ELIZA_DIR\""
