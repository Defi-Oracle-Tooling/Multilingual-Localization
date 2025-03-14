#!/bin/bash

# Synchronize translations based on changes to source files
# Usage: ./scripts/localization-sync.sh [--source ./docs/en/] [--languages "es,fr,de"]

set -e

# Parse command line arguments
SOURCE_DIR="./docs/en/"
LANGUAGES="es,fr,de,ja,zh-cn,ar"
SERVICE="azure"

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --source)
      SOURCE_DIR="$2"
      shift
      shift
      ;;
    --languages)
      LANGUAGES="$2"
      shift
      shift
      ;;
    --service)
      SERVICE="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate source directory
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory does not exist: $SOURCE_DIR"
  exit 1
fi

# Process each language
echo "Synchronizing translations based on changes to source files..."
echo "Source directory: $SOURCE_DIR"
echo "Languages: $LANGUAGES"
echo "Translation service: $SERVICE"

IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGES"
for lang in "${LANG_ARRAY[@]}"; do
  echo "Processing language: $lang"
  
  # Create target directory
  TARGET_DIR="./docs/$lang/"
  mkdir -p "$TARGET_DIR"
  
  # Translate files
  ./scripts/translate-md.sh --input "$SOURCE_DIR" --output "$TARGET_DIR" --lang "$lang" --service "$SERVICE"
done

echo "Synchronization complete!"
