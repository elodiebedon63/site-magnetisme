import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

export const GET: APIRoute = async ({ site }) => {
  const url = site?.href.replace(/\/$/, '') ?? 'https://magnetisme.elodiebedon.com';
  const buffer = await QRCode.toBuffer(url, {
    width: 600,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
};
