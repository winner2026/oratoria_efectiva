import fs from 'fs';
import path from 'path';

console.log('--- INICIANDO VERIFICACIÓN DE LANDING & PRODUCTOS ---');

const errors = [];
const successes = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error(`❌ FALLÓ: ${message}`);
  } else {
    successes.push(message);
    console.log(`✅ ÉXITO: ${message}`);
  }
}

// 1. Verificar Imagen del libro en public/
const imgPath = path.join(process.cwd(), 'public', 'libro-protocolo-respuestas-inteligentes.jpg');
assert(fs.existsSync(imgPath), 'La imagen del libro existe en public/libro-protocolo-respuestas-inteligentes.jpg');
if (fs.existsSync(imgPath)) {
  const stats = fs.statSync(imgPath);
  assert(stats.size > 50000, `El tamaño de la imagen es válido (${stats.size} bytes)`);
}

// 2. Verificar archivos de rutas creadas
const landingPath = path.join(process.cwd(), 'app', 'protocolo-de-respuestas-inteligentes', 'page.tsx');
assert(fs.existsSync(landingPath), 'Existe app/protocolo-de-respuestas-inteligentes/page.tsx');

const redirectPath = path.join(process.cwd(), 'app', 'protocolo-preguntas-inteligentes', 'page.tsx');
assert(fs.existsSync(redirectPath), 'Existe app/protocolo-preguntas-inteligentes/page.tsx (alias/redirect)');

const productosPath = path.join(process.cwd(), 'app', 'productos', 'page.tsx');
assert(fs.existsSync(productosPath), 'Existe app/productos/page.tsx (catálogo central)');

// 3. Verificar contenido de app/protocolo-de-respuestas-inteligentes/page.tsx
if (fs.existsSync(landingPath)) {
  const content = fs.readFileSync(landingPath, 'utf8');

  const requiredPhrases = [
    'Protocolo de Respuestas Inteligentes',
    'https://pay.hotmart.com/Q108091621U',
    'te quedas en blanco',
    'ehhh...',
    'bueno...',
    'Protocolo de los 3 Segundos',
    '3 Estructuras Mentales',
    '25',
    'Admitir Desconocimiento',
    'Preguntas Capciosas',
    'Frenar Interrupciones',
    'Ataques Personales',
    'libro-protocolo-respuestas-inteligentes.jpg',
    'Víctor Martínez',
    'showStickyCta'
  ];

  for (const phrase of requiredPhrases) {
    assert(content.includes(phrase), `La landing contiene la frase/clave esencial: "${phrase}"`);
  }

  // Verificar que usa <img> y no <Image fill> para evitar hydration mismatch con DarkReader
  assert(!content.includes('<Image'), 'La landing usa etiquetas <img> nativas (cero hydration mismatch con DarkReader)');
}

// 4. Verificar app/page.tsx (página principal oratoriaefectiva.in)
const homePath = path.join(process.cwd(), 'app', 'page.tsx');
assert(fs.existsSync(homePath), 'Existe app/page.tsx');
if (fs.existsSync(homePath)) {
  const homeContent = fs.readFileSync(homePath, 'utf8');
  assert(homeContent.includes('id="productos"'), 'app/page.tsx contiene la sección id="productos"');
  assert(homeContent.includes('href="#productos"'), 'app/page.tsx tiene enlaces de navegación hacia #productos');
  assert(homeContent.includes('/protocolo-de-respuestas-inteligentes'), 'app/page.tsx enlaza hacia la nueva landing /protocolo-de-respuestas-inteligentes');
  assert(homeContent.includes('libro-protocolo-respuestas-inteligentes.jpg'), 'app/page.tsx muestra la portada del libro');
  assert(!homeContent.includes('<Image'), 'app/page.tsx usa <img> nativo sin riesgo de hydration mismatch');
}

// 5. Verificar app/productos/page.tsx
if (fs.existsSync(productosPath)) {
  const prodContent = fs.readFileSync(productosPath, 'utf8');
  assert(prodContent.includes('/protocolo-de-respuestas-inteligentes'), 'app/productos/page.tsx enlaza a la landing del libro');
  assert(prodContent.includes('libro-protocolo-respuestas-inteligentes.jpg'), 'app/productos/page.tsx muestra la portada del libro');
  assert(prodContent.includes('/sin_miedo_a_hablar'), 'app/productos/page.tsx contiene el curso Sin Miedo');
  assert(!prodContent.includes('<Image'), 'app/productos/page.tsx usa <img> nativo sin riesgo de hydration mismatch');
}

console.log('\n--- RESUMEN DE VERIFICACIÓN ---');
console.log(`Pruebas exitosas: ${successes.length}`);
console.log(`Pruebas fallidas: ${errors.length}`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE.');
  process.exit(0);
}
