import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

async function main() {
  console.log('--- STARTING CSS & TAILWIND VERIFICATION ---');

  // 1. Verify .vscode/settings.json
  const settingsPath = path.resolve(process.cwd(), '.vscode', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    throw new Error('.vscode/settings.json does not exist');
  }

  const rawSettings = fs.readFileSync(settingsPath, 'utf-8');
  const settings = JSON.parse(rawSettings);

  console.log('Checking .vscode/settings.json...');
  if (settings['css.lint.unknownAtRules'] !== 'ignore') {
    throw new Error('css.lint.unknownAtRules is not set to ignore');
  }
  console.log('✓ .vscode/settings.json properly configured with "css.lint.unknownAtRules": "ignore"');

  // 2. Verify globals.css syntax & compilation with PostCSS + Tailwind
  const cssPath = path.resolve(process.cwd(), 'app', 'globals.css');
  if (!fs.existsSync(cssPath)) {
    throw new Error('app/globals.css does not exist');
  }

  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  console.log(`Read ${cssPath} (${cssContent.length} bytes). Compiling through PostCSS & Tailwind...`);

  const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.js');

  const result = await postcss([
    tailwindcss(tailwindConfigPath),
    autoprefixer()
  ]).process(cssContent, {
    from: cssPath,
    to: undefined
  });

  const warnings = result.warnings();
  console.log(`PostCSS compilation finished with ${warnings.length} warnings.`);
  warnings.forEach(w => console.warn(`[Warning] ${w.toString()}`));

  console.log(`Generated compiled CSS: ${result.css.length} characters.`);
  console.log('✓ Tailwind & PostCSS compilation successfully verified without errors.');

  const report = {
    timestamp: new Date().toISOString(),
    settingsVerified: true,
    cssCompiledSuccessfully: true,
    warningsCount: warnings.length,
    outputSize: result.css.length
  };

  fs.writeFileSync(
    path.resolve(process.cwd(), 'scratch', 'css-verification-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('Report written to scratch/css-verification-report.json');
}

main().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
