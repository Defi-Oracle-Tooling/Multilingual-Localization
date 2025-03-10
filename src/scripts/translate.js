#!/usr/bin/env node

/**
 * CLI script for translating markdown files
 */

const { program } = require('commander');
const path = require('path');
const { translateMarkdownBatch } = require('../localization/markdown-processor');

// Configure the command line interface
program
  .name('translate')
  .description('Translate markdown files from one language to another')
  .requiredOption('--input <dir>', 'Source directory containing markdown files')
  .requiredOption('--output <dir>', 'Target directory for translated files')
  .requiredOption('--lang <code>', 'Target language code (e.g., es, fr, de)')
  .option('--service <name>', 'Translation service to use (azure, deepl, openai)', 'azure')
  .option('--preserve-code <bool>', 'Preserve code blocks in translation', 'true')
  .option('--preserve-front-matter <bool>', 'Preserve front matter in translation', 'true')
  .parse(process.argv);

const options = program.opts();

// Convert string boolean options to actual booleans
const preserveCodeBlocks = options.preserveCode === 'true';
const preserveFrontMatter = options.preserveFrontMatter === 'true';

// Run the translation
async function main() {
  try {
    console.log(
      `Translating markdown files from ${options.input} to ${options.output} (${options.lang})`
    );

    const results = await translateMarkdownBatch({
      inputDir: options.input,
      outputDir: options.output,
      targetLanguage: options.lang,
      service: options.service,
      preserveCodeBlocks,
      preserveFrontMatter
    });

    // Print results
    console.log(`\nTranslation complete. Results:`);
    console.log(`- Files processed: ${results.length}`);
    console.log(`- Successful translations: ${results.filter((r) => r.success).length}`);
    console.log(`- Failed translations: ${results.filter((r) => !r.success).length}`);

    // Print any errors
    const errors = results.filter((r) => !r.success);
    if (errors.length > 0) {
      console.error('\nErrors:');
      errors.forEach((error) => {
        console.error(`- ${error.error}`);
      });
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
