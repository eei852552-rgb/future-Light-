import { cp, mkdir, rm } from 'node:fs/promises';

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });
await cp('index.html', 'www/index.html');
await cp('styles.css', 'www/styles.css');
await cp('manifest.webmanifest', 'www/manifest.webmanifest');
await cp('js', 'www/js', { recursive: true });
await cp('public', 'www/public', { recursive: true });
console.log('Prepared Future Light web assets in www/');
