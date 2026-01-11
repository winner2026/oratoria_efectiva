import { headers } from 'next/headers';
import { prisma } from '@/infrastructure/db/client';
import { getClientIP } from '@/lib/fingerprint/generateFingerprint'; // Reuse helper if possible or just extract

export default async function HoneypotPage() {
  const headersList = await headers();
  // We need to convert ReadonlyHeaders to Headers compatible or just extract check
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  
  // 🍯 SILENT TRAP: Log the intruder
  try {
     await prisma.suspiciousActivity.create({
        data: {
          ip: ip,
          endpoint: '/admin-login',
          reason: 'HONEYPOT_TRIGGER',
          severity: 'HIGH'
        }
     });
     console.warn(`[HONEYPOT] Trapped visitor at /admin-login from ${ip}`);
  } catch (e) {
     // Setup might fail if DB is busy, ignore to not crash honeypot
  }

  // Fake 403 Page (Generic Nginx/Apache style to look boring)
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
       <h1>403 Forbidden</h1>
       <hr style={{ width: '300px' }} />
       <p>nginx/1.18.0 (Ubuntu)</p>
    </div>
  );
}
