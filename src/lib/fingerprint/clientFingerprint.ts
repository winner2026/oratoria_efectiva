export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server-side';

  // 1. Canvas Fingerprinting (Standard technique)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'unknown-canvas';

  canvas.width = 200;
  canvas.height = 50;
  ctx.textBaseline = 'top';
  ctx.font = '14px "Arial"'; 
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('OratoriaPRO_v1', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('OratoriaPRO_v1', 4, 17);

  const canvasData = canvas.toDataURL();
  
  // 2. High-Entropy Browser Details
  const nav = navigator;
  const details = [
    nav.userAgent,
    nav.language,
    (nav as any).deviceMemory || 'unknown',
    (nav as any).hardwareConcurrency || 'unknown',
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    (window.screen || {}).width + 'x' + (window.screen || {}).height, 
    (window.screen || {}).colorDepth,
    canvasData
  ].join('||');

  // 3. Hash it (SHA-256)
  const encoder = new TextEncoder();
  const data = encoder.encode(details);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
