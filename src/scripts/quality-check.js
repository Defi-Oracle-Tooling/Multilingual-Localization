#!/usr/bin/env node

/**
 * CLI script for checking translation quality
 */

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { checkDirectoryQuality, generateQualityReport } = require('../localization/quality-checker');

const writeFile = promisify(fs.writeFile);

// Configure the command line interface
program
  .name('quality-check')
  .description('Check quality of translated markdown files')
  .requiredOption('--dir <dir>', 'Directory containing translated markdown files')
  .requiredOption('--lang <code>', 'Language code of the translations')
  .option('--min-score <score>', 'Minimum score to pass', '70')
  .option('--report <file>', 'Output file for the quality report')
  .parse(process.argv);

const options = program.opts();

// Convert min-score to number
const minScore = parseInt(options.minScore, 10);

// Run the quality check
async function main() {
  try {
    console.log(`Checking quality of translations in ${options.dir} (${options.lang})`);

    const results = await checkDirectoryQuality(options.dir, options.lang, '**/*.md', minScore);

    // Print results
    console.log(`\nQuality check complete. Results:`);
    console.log(`- Files checked: ${results.length}`);
    console.log(`- Files passed: ${results.filter((r) => r.passed).length}`);
    console.log(`- Files failed: ${results.filter((r) => !r.passed).length}`);

    // Generate and save report if requested
    if (options.report) {
      const report = await generateQualityReport(options.dir, options.lang, '**/*.md', minScore);

      await writeFile(options.report, report, 'utf-8');
      console.log(`\nQuality report saved to ${options.report}`);
    }

    // Exit with error if any files failed
    if (results.some((r) => !r.passed)) {
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
