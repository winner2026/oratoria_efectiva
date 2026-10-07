import https from 'https';
import fs from 'fs';

async function runTests() {
  const target = 'https://www.oratoriaefectiva.in'; // Usando WWW para evitar el 308 redirect de Vercel
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  function record(name, passed, detail) {
    results.total++;
    if (passed) results.passed++;
    else results.failed++;
    results.tests.push({ name, status: passed ? 'PASS' : 'FAIL', detail });
  }

  const agent = new https.Agent({ rejectUnauthorized: false });

interface FetchResult {
  statusCode?: number;
  headers?: Record<string, any>;
  body?: string;
  error?: string;
}

  const fetchUrl = (url: string): Promise<FetchResult> => {
    return new Promise((resolve) => {
      https.get(url, { agent }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
      }).on('error', (e) => resolve({ error: e.message }));
    });
  };

  console.log(`Starting security audit for ${target}...`);

  // Test 1: HTTPS Enforced
  const mainReq = await fetchUrl(target);
  record(
    'HTTPS is active and accessible', 
    mainReq.statusCode === 200, 
    `Status: ${mainReq.statusCode || mainReq.error}`
  );

  const headers = mainReq.headers || {};
  
  record(
    'X-Frame-Options (Clickjacking protection)', 
    !!headers['x-frame-options'], 
    headers['x-frame-options'] || 'Header missing'
  );

  record(
    'X-Content-Type-Options (MIME sniffing protection)', 
    !!headers['x-content-type-options'], 
    headers['x-content-type-options'] || 'Header missing'
  );

  record(
    'Strict-Transport-Security (HSTS)', 
    !!headers['strict-transport-security'], 
    headers['strict-transport-security'] || 'Header missing'
  );

  record(
    'Content-Security-Policy (XSS protection)', 
    !!headers['content-security-policy'], 
    headers['content-security-policy'] || 'Header missing'
  );

  const traversalReq = await fetchUrl(`${target}/../../../../etc/passwd`);
  record(
    'Path Traversal blocked', 
    traversalReq.statusCode === 400 || traversalReq.statusCode === 404, 
    `Status: ${traversalReq.statusCode}`
  );

  const xssReq = await fetchUrl(`${target}/?q=<script>alert(1)</script>`);
  record(
    'URL XSS blocked/not reflected unescaped', 
    !xssReq.body?.includes('<script>alert(1)</script>'), 
    'Checked response body for unescaped payload'
  );

  fs.writeFileSync('audit-results.json', JSON.stringify(results, null, 2));
  console.log('Audit completed. Results saved to audit-results.json');
}

runTests();
