import QRCode from 'qrcode';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function resolveUrl() {
  if (existsSync('./CNAME')) {
    const domain = readFileSync('./CNAME', 'utf8').trim();
    if (domain) return `https://${domain}`;
  }
  return process.env.CUSTOM_DOMAIN
    ? `https://${process.env.CUSTOM_DOMAIN.trim()}`
    : 'https://elodiebedon63.github.io/site-magnetisme';
}

const url = resolveUrl();
const debugDir = fileURLToPath(new URL('../debug/', import.meta.url));
mkdirSync(debugDir, { recursive: true });
const outputPath = fileURLToPath(new URL('../debug/qrcode.png', import.meta.url));

await QRCode.toFile(outputPath, url, {
  width: 600,
  margin: 2,
  color: { dark: '#000000', light: '#ffffff' },
});

console.log(`[QR Code] généré dans debug/qrcode.png → ${url}`);
