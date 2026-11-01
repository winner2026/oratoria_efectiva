import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();

// Pages to inspect
const targets = [
  { name: 'Catálogo General', path: 'app/productos/page.tsx' },
  { name: 'Protocolo de Respuestas Inteligentes', path: 'app/protocolo-de-respuestas-inteligentes/page.tsx' },
  { name: 'Protocolo Preguntas Inteligentes', path: 'app/protocolo-preguntas-inteligentes/page.tsx' },
  { name: 'Curso Sin Miedo a Hablar', path: 'app/sin_miedo_a_hablar/page.tsx' },
  { name: 'Voz Efectiva / Diagnóstico', path: 'app/voz_efectiva/page.tsx' },
  { name: 'Lead Magnet / Regalos', path: 'app/regalos/page.tsx' },
  { name: 'Onboarding / Diagnóstico Inicial', path: 'app/onboarding/page.tsx' }
];

const layoutPath = path.join(PROJECT_ROOT, 'app/layout.tsx');
const layoutCode = fs.readFileSync(layoutPath, 'utf8');

const globalTracking = {
  hasGTM: layoutCode.includes('googletagmanager.com/gtm.js') && layoutCode.includes('GTM-5RJT8LRJ'),
  gtmId: 'GTM-5RJT8LRJ',
  hasGA4: layoutCode.includes('googletagmanager.com/gtag/js') && layoutCode.includes('G-K54S39NNTD'),
  ga4Id: 'G-K54S39NNTD',
  hasGoogleAds: layoutCode.includes('AW-18488283276'),
  adsId: 'AW-18488283276',
  appliesToAllRoutes: true
};

const results = targets.map(target => {
  const fullPath = path.join(PROJECT_ROOT, target.path);
  if (!fs.existsSync(fullPath)) {
    return { ...target, exists: false };
  }

  const code = fs.readFileSync(fullPath, 'utf8');
  
  // Check for Hotmart links
  const hotmartMatch = code.match(/https:\/\/pay\.hotmart\.com\/[A-Za-z0-9?&=_-]+/g) || [];
  
  // Check for internal lead capture
  const hasDirectLeadForm = /<input[^>]+type=["']email["']|<LeadCaptureForm/i.test(code);
  
  // Check for custom event logging
  const hasCustomEventLogging = /logEvent\(/i.test(code) || /fetch\(["']\/api\/events["']/i.test(code);
  
  // Check for dynamic UTM / Hotmart SRC attribution
  const hasUtmForwarding = /utm_|src=|URLSearchParams/i.test(code) && hotmartMatch.length > 0 && /searchParams/i.test(code);

  return {
    product: target.name,
    file: target.path,
    exists: true,
    globalGA4Active: globalTracking.hasGA4,
    globalGTMActive: globalTracking.hasGTM,
    hasDirectLeadForm,
    hotmartCheckoutUrls: Array.from(new Set(hotmartMatch)),
    hasHotmartUtmOrSrcForwarding: hasUtmForwarding,
    hasCustomEventLogging
  };
});

const report = {
  timestamp: new Date().toISOString(),
  globalTracking,
  pagesAudited: results,
  summary: {
    totalAudited: results.length,
    pagesWithGA4PageviewTracking: results.filter(r => r.globalGA4Active).length,
    pagesWithDirectLeadCaptureForm: results.filter(r => r.hasDirectLeadForm).length,
    pagesWithHotmartCheckout: results.filter(r => r.hotmartCheckoutUrls && r.hotmartCheckoutUrls.length > 0).length,
    pagesWithHotmartUtmTracking: results.filter(r => r.hasHotmartUtmOrSrcForwarding).length,
    pagesWithInternalEventLogging: results.filter(r => r.hasCustomEventLogging).length
  }
};

fs.writeFileSync(path.join(PROJECT_ROOT, 'audit-lead-tracking-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('✅ Auditoría completada con éxito. Resumen:');
console.log(JSON.stringify(report.summary, null, 2));
