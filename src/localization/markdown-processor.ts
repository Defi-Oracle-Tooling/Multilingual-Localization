/**
 * Markdown processor for the localization module
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import matter from 'gray-matter';
import {
  LanguageCode,
  TranslationOptions,
  TranslationResult,
  MarkdownTranslationOptions
} from './types';
import { translateText } from './translation-service';

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Extract code blocks from markdown content
 */
function extractCodeBlocks(content: string): { content: string; codeBlocks: string[] } {
  const codeBlocks: string[] = [];
  const codeBlockRegex = /```[\s\S]*?```/g;

  // Replace code blocks with placeholders
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  return { content: contentWithoutCodeBlocks, codeBlocks };
}

/**
 * Restore code blocks to markdown content
 */
function restoreCodeBlocks(content: string, codeBlocks: string[]): string {
  let restoredContent = content;

  for (let i = 0; i < codeBlocks.length; i++) {
    restoredContent = restoredContent.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
  }

  return restoredContent;
}

/**
 * Translate markdown content
 */
export async function translateMarkdownContent(
  content: string,
  options: TranslationOptions
): Promise<string> {
  try {
    const preserveCodeBlocks = options.preserveCodeBlocks !== false;

    let processedContent = content;
    let codeBlocks: string[] = [];

    // Extract code blocks if needed
    if (preserveCodeBlocks) {
      const extracted = extractCodeBlocks(processedContent);
      processedContent = extracted.content;
      codeBlocks = extracted.codeBlocks;
    }

    // Translate the content
    const result = await translateText(processedContent, options);

    if (!result.success) {
      throw new Error(`Translation failed: ${result.error}`);
    }

    let translatedContent = result.translated;

    // Restore code blocks if needed
    if (preserveCodeBlocks) {
      translatedContent = restoreCodeBlocks(translatedContent, codeBlocks);
    }

    return translatedContent;
  } catch (error) {
    console.error('Error translating markdown content:', error);
    throw error;
  }
}

/**
 * Translate a markdown file
 */
export async function translateMarkdownFile(
  options: MarkdownTranslationOptions
): Promise<TranslationResult> {
  try {
    // Ensure the input file exists
    if (!fs.existsSync(options.inputFile)) {
      throw new Error(`Input file not found: ${options.inputFile}`);
    }

    // Read the input file
    const content = await readFile(options.inputFile, 'utf-8');

    // Translate the content
    const translatedContent = await translateMarkdownContent(content, options);

    // Ensure the output directory exists
    const outputDir = path.dirname(options.outputFile);
    if (!fs.existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Write the translated content to the output file
    await writeFile(options.outputFile, translatedContent, 'utf-8');

    return {
      original: content,
      translated: translatedContent,
      language: options.targetLanguage,
      success: true
    };
  } catch (error) {
    console.error('Error translating markdown file:', error);

    return {
      original: '',
      translated: '',
      language: options.targetLanguage,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
