#!/bin/bash

# Translate Markdown files from one language to another
# Usage: ./scripts/translate-md.sh --input ./docs/en/ --output ./docs/es/ --lang es

set -e

# Parse command line arguments
INPUT_DIR=""
OUTPUT_DIR=""
TARGET_LANG=""
SOURCE_LANG="en"
SERVICE="azure"

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --input)
      INPUT_DIR="$2"
      shift
      shift
      ;;
    --output)
      OUTPUT_DIR="$2"
      shift
      shift
      ;;
    --lang)
      TARGET_LANG="$2"
      shift
      shift
      ;;
    --source)
      SOURCE_LANG="$2"
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

# Validate required arguments
if [ -z "$INPUT_DIR" ] || [ -z "$OUTPUT_DIR" ] || [ -z "$TARGET_LANG" ]; then
  echo "Error: Missing required arguments"
  echo "Usage: ./scripts/translate-md.sh --input <input_dir> --output <output_dir> --lang <target_lang> [--source <source_lang>] [--service <service>]"
  exit 1
fi

# Ensure the input directory exists
if [ ! -d "$INPUT_DIR" ]; then
  echo "Error: Input directory does not exist: $INPUT_DIR"
  exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Run the translation
echo "Translating Markdown files from $SOURCE_LANG to $TARGET_LANG..."
echo "Input directory: $INPUT_DIR"
echo "Output directory: $OUTPUT_DIR"
echo "Translation service: $SERVICE"

# Use the Node.js script for translation
node dist/scripts/translate.js batch \
  --input "$INPUT_DIR" \
  --output "$OUTPUT_DIR" \
  --target "$TARGET_LANG" \
  --source "$SOURCE_LANG" \
  --service "$SERVICE"

echo "Translation complete!"
