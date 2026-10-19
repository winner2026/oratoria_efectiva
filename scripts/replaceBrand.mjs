import fs from 'fs';

const filesToUpdate = [
  'app/productos/page.tsx',
  'app/protocolo-de-respuestas-inteligentes/page.tsx',
  'app/regalos/page.tsx',
  'app/sin_miedo_a_hablar/page.tsx',
  'app/sin_miedo_a_hablar/page.old.tsx',
  'app/gracias/page.tsx',
  'app/auth/login/page.tsx',
  'app/vocalgym/page.tsx',
  'app/voz_efectiva/page.tsx',
  'app/waitlist/page.tsx',
  'app/api/cron/send-reminders/route.ts',
  'app/api/send-email/route.ts',
  'src/lib/referrals/referralSystem.ts',
  'src/lib/streaks/streakSystem.ts'
];

for (const relPath of filesToUpdate) {
  if (fs.existsSync(relPath)) {
    let content = fs.readFileSync(relPath, 'utf8');
    let original = content;

    // Special span cases like VÍCTOR MARTÍNEZ <span className="text-amber-400">PRO</span>
    content = content.replace(/V[ÍI]CTOR\s+MART[ÍI]NEZ\s*<span className=["']text-amber-400["']>PRO<\/span>/g, 'ORATORIA <span className="text-amber-400">EFECTIVA</span>');
    content = content.replace(/V[ÍI]CTOR\s+MART[ÍI]NEZ\s+PRO/g, 'ORATORIA EFECTIVA');
    content = content.replace(/V[íi]ctor\s+Mart[íi]nez\s+Pro/g, 'Oratoria Efectiva');
    
    // Clean up if double
    content = content.replace(/Oratoria Efectiva - Oratoria Efectiva/g, 'Oratoria Efectiva');

    if (content !== original) {
      fs.writeFileSync(relPath, content, 'utf8');
      console.log('Actualizado:', relPath);
    } else {
      console.log('Sin cambios:', relPath);
    }
  } else {
    console.log('No existe:', relPath);
  }
}
console.log('Listo.');
