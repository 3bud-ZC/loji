import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('dist/index.html', 'utf8');

const scriptMatches = html.match(/src="([^"]+)"/g) || [];
const linkMatches = html.match(/href="([^"]+)"/g) || [];

console.log('Validating dist/index.html references...');

let hasError = false;

for (const s of scriptMatches) {
  const url = s.replace(/src="|"/g, '');
  if (url.startsWith('/loji/')) {
    const localPath = path.join('dist', url.replace('/loji/', ''));
    if (!fs.existsSync(localPath)) {
      console.error('Missing script file:', localPath);
      hasError = true;
    } else {
      console.log('✓ Script verified:', localPath);
    }
  }
}

for (const l of linkMatches) {
  const url = l.replace(/href="|"/g, '');
  if (url.startsWith('/loji/')) {
    const localPath = path.join('dist', url.replace('/loji/', ''));
    if (!fs.existsSync(localPath)) {
      console.error('Missing link file:', localPath);
      hasError = true;
    } else {
      console.log('✓ Link verified:', localPath);
    }
  } else if (url === './favicon.svg') {
    const localPath = path.join('dist', 'favicon.svg');
    if (!fs.existsSync(localPath)) {
      console.error('Missing favicon:', localPath);
      hasError = true;
    } else {
      console.log('✓ Favicon verified:', localPath);
    }
  }
}

if (hasError) {
  console.error('Validation failed!');
  process.exit(1);
} else {
  console.log('All local assets are present and properly resolved with base /loji/.');
}
