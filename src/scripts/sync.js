#!/usr/bin/env node

/**
 * CLI script for synchronizing translations
 */

const { program } = require('commander');
const path = require('path');
const { synchronizeTranslations } = require('@solacenet/shared-markdown-utils');

// Configure the command line interface
program
  .name('sync')
  .description('Synchronize translations based on changes to source files')
  .requiredOption('--source <dir>', 'Source directory containing original markdown files')
  .requiredOption('--targets <dirs>', 'Comma-separated list of target directories')
  .option('--service <name>', 'Translation service to use (azure, deepl, openai)', 'azure')
  .option('--preserve-code <bool>', 'Preserve code blocks in translation', 'true')
  .option('--preserve-front-matter <bool>', 'Preserve front matter in translation', 'true')
  .parse(process.argv);

const options = program.opts();

// Convert string boolean options to actual booleans
const preserveCodeBlocks = options.preserveCode === 'true';
const preserveFrontMatter = options.preserveFrontMatter === 'true';

// Split target directories
const targetDirs = options.targets.split(',').map((dir) => dir.trim());

// Run the synchronization
async function main() {
  try {
    console.log(`Synchronizing translations from ${options.source} to ${targetDirs.join(', ')}`);

    const results = await synchronizeTranslations(options.source, targetDirs, {
      service: options.service,
      preserveCodeBlocks,
      preserveFrontMatter
    });

    // Print results
    console.log(`\nSynchronization complete. Results:`);

    let totalFiles = 0;
    let successfulFiles = 0;
    let failedFiles = 0;

    for (const [lang, langResults] of Object.entries(results)) {
      totalFiles += langResults.length;
      successfulFiles += langResults.filter((r) => r.success).length;
      failedFiles += langResults.filter((r) => !r.success).length;

      console.log(
        `- ${lang}: ${langResults.length} files, ${langResults.filter((r) => r.success).length} successful, ${langResults.filter((r) => !r.success).length} failed`
      );
    }

    console.log(
      `\nTotal: ${totalFiles} files, ${successfulFiles} successful, ${failedFiles} failed`
    );

    // Exit with error if any translations failed
    if (failedFiles > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
