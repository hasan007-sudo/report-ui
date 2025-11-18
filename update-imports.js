import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const srcDir = './src';

function updateImports(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace ~/ with @/
  if (content.includes('~/')) {
    content = content.replace(/~\//g, '@/');
    modified = true;
  }

  // Remove "use client" directive
  if (content.includes('"use client"')) {
    content = content.replace(/"use client";\s*/g, '');
    content = content.replace(/'use client';\s*/g, '');
    modified = true;
  }

  // Remove Next.js specific imports (useParams, etc.)
  if (content.includes('next/navigation')) {
    content = content.replace(/import\s+{[^}]*}\s+from\s+['"]next\/navigation['"];?\s*/g, '');
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateImports(filePath);
    }
  }
}

console.log('Updating imports...');
processDirectory(srcDir);
console.log('Done!');
