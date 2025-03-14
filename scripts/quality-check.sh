#!/bin/bash

# Check quality of translated markdown files
# Usage: ./scripts/quality-check.sh [--dir ./docs/] [--languages "es,fr,de"] [--min-score 70]

set -e

# Parse command line arguments
BASE_DIR="./docs/"
LANGUAGES="es,fr,de,ja,zh-cn,ar"
MIN_SCORE=70

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --dir)
      BASE_DIR="$2"
      shift
      shift
      ;;
    --languages)
      LANGUAGES="$2"
      shift
      shift
      ;;
    --min-score)
      MIN_SCORE="$2"
      shift
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate base directory
if [ ! -d "$BASE_DIR" ]; then
  echo "Error: Base directory does not exist: $BASE_DIR"
  exit 1
fi

# Process each language
echo "Checking quality of translated markdown files..."
echo "Base directory: $BASE_DIR"
echo "Languages: $LANGUAGES"
echo "Minimum score: $MIN_SCORE"

IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGES"
for lang in "${LANG_ARRAY[@]}"; do
  echo "Checking language: $lang"
  
  # Check if language directory exists
  LANG_DIR="$BASE_DIR$lang/"
  if [ ! -d "$LANG_DIR" ]; then
    echo "Warning: Language directory does not exist: $LANG_DIR"
    continue
  fi
  
  # Run quality check
  node dist/scripts/quality-check.js \
    --dir "$LANG_DIR" \
    --language "$lang" \
    --min-score "$MIN_SCORE" \
    --report "./quality-reports/$lang-report.md"
done

echo "Quality check complete!"
