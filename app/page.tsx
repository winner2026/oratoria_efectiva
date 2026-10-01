import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Sin Miedo a Hablar - Oratoria Efectiva',
  description: 'Recupera tu voz y hazla sonar con claridad.',
};

export default function HomePage() {
  const checkoutUrl = 'https://pay.hotmart.com/F99862019P?off=dlcepqmr&hotfeature=51';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-orange-600/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden border-b border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-white leading-[1.1]">
            <span className="text-orange-600">Sin Miedo a Hablar:</span> recupera tu voz y hazla sonar con claridad
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Aprende a hablar con identidad, sin miedo, y con el poder de ser escuchado. Descubre cómo tu palabra puede tener presencia, peso y verdad.
          </p>
          
          {/* VSL (Video Sales Letter) */}
          <div className="w-full max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-black">
            <div className="relative pb-[56.25%] h-0">
              <iframe 
                src="https://www.youtube.com/embed/FQxA4yntAEY?si=XZlIadv_fLx5l-Lb" 
                title="Video de presentación" 
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <a 
            href={checkoutUrl}
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-black py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-[0_0_30px_-5px_rgba(234,88,12,0.5)]"
          >
            COMPRAR AHORA
          </a>
        </div>
      </section>

      {/* 2. SOBRE EL CONTENIDO */}
      <section className="py-20 px-6 bg-neutral-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-black text-orange-600 tracking-widest uppercase mb-4 border-b border-orange-600/30 pb-2">
            Sobre el contenido
          </h2>
          
          <div className="space-y-6 text-xl text-neutral-300 leading-relaxed font-light">
            <p>
              Con el curso <strong className="text-white">Sin Miedo a Hablar</strong>, recupera tu voz y hazla sonar con claridad.
            </p>
            <p>
              Aprende a identificar el origen de tu miedo, a desactivarlo desde su raíz, a usar tu respiración como ancla, y a proyectar una voz firme, sin impostaciones, sin máscaras.
            </p>
            <p className="text-white font-medium border-l-4 border-orange-600 pl-6 my-8 py-2">
              Al finalizar, no solo vas a hablar mejor. Vas a hablar con identidad, sin miedo, y con el poder de ser escuchado.
            </p>
            <p>
              Inscríbete ahora y descubre cómo tu palabra puede tener presencia, peso y verdad.
            </p>
          </div>

          <div className="mt-16 text-center">
            <p className="text-orange-500 font-bold tracking-widest uppercase mb-4 text-sm animate-pulse">
              ESTA OFERTA PUEDE TERMINAR EN BREVE
            </p>
            <a 
              href={checkoutUrl}
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-black py-4 px-10 rounded-full text-lg transition-transform hover:scale-105"
            >
              COMPRAR AHORA
            </a>
          </div>
        </div>
      </section>

      {/* 3. SOBRE EL CREADOR */}
      <section className="py-20 px-6 bg-neutral-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-black text-orange-600 tracking-widest uppercase mb-8 border-b border-orange-600/30 pb-2">
            Conoce mejor a quien ha creado el contenido
          </h2>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-6 mb-8">
              <img 
                src="/profile.png" 
                alt="Víctor Martínez" 
                className="w-24 h-24 rounded-full object-cover border-2 border-orange-600 shrink-0 shadow-[0_0_15px_rgba(234,88,12,0.3)]"
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Víctor Martínez</h3>
                <p className="text-orange-500 font-medium">Oratoria_Efectiva</p>
              </div>
            </div>
            
            <div className="space-y-4 text-neutral-400">
              <p>
                ¡Bienvenido a Oratoria Efectiva con Víctor Martínez! Un viaje de transformación profunda a través del poder de tu voz.
              </p>
              <p>
                Aprende a comunicar con autenticidad y dominar el arte de hablar en público para impactar vidas, abrir puertas y alcanzar tu máximo potencial.
              </p>
              <p>
                Descubre la fuerza que ya vive en ti y libérala con confianza y propósito. Entrena para superar bloqueos internos, estructurar ideas que dejen huella y construir una presencia auténtica frente a cualquier audiencia.
              </p>
              <p className="text-white font-medium italic pt-4">
                Este es tu momento. Esta es tu oportunidad. Y nosotros estamos aquí para acompañarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GARANTÍA */}
      <section className="py-20 px-6 bg-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-sm font-black text-orange-950 tracking-widest uppercase mb-10 border-b border-orange-700 pb-2">
            G A R A N T Í A
          </h2>
          
          <div className="text-7xl mb-6">🛡️</div>
          <h3 className="text-4xl font-bold mb-4">Garantía incondicional de 7 días</h3>
          <p className="text-xl opacity-90 max-w-xl mx-auto">
            Tendrás tu dinero de vuelta sin preguntas hasta 7 días después de la compra.
          </p>
        </div>
      </section>

      {/* 5. PRECIO Y CIERRE */}
      <section className="py-24 px-6 bg-neutral-950 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-neutral-400 mb-6 flex items-center justify-center gap-2">
            <span>📱</span> Accede al contenido desde cualquier dispositivo.
          </p>
          
          <div className="mb-10">
            <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2">POR APENAS</p>
            <p className="text-7xl font-black text-white">US$ 17.00</p>
          </div>
          
          <a 
            href={checkoutUrl}
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-black py-5 px-12 rounded-full text-xl transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(234,88,12,0.4)] mb-6"
          >
            COMPRAR AHORA
          </a>
          
          <p className="text-sm text-neutral-500 font-bold flex items-center justify-center gap-2">
            <span>🔒</span> PAGO 100% SEGURO CON ACCESO INMEDIATO
          </p>
        </div>
      </section>

      {/* 6. PREGUNTAS FRECUENTES */}
      <section className="py-24 px-6 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <details className="group bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer">
              <summary className="font-bold text-lg text-white p-6 list-none flex justify-between items-center">
                ¿Para quién es este producto?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400">
                Para cualquier profesional, emprendedor o persona que sienta que el miedo escénico lo paraliza o le impide comunicar sus ideas con la fuerza y claridad que merece.
              </div>
            </details>

            <details className="group bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer">
              <summary className="font-bold text-lg text-white p-6 list-none flex justify-between items-center">
                ¿Cómo funciona el 'Plazo de Garantía'?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400">
                Tienes 7 días a partir de la confirmación de tu pago para evaluar el curso. Si dentro de ese plazo consideras que no es para ti, puedes solicitar el reembolso total a través de Hotmart y te devolveremos tu dinero sin hacer preguntas.
              </div>
            </details>

            <details className="group bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer">
              <summary className="font-bold text-lg text-white p-6 list-none flex justify-between items-center">
                ¿Qué es y cómo funciona el Certificado de Conclusión digital?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400">
                Al completar todas las lecciones del curso, la plataforma generará automáticamente un certificado a tu nombre que valida tu participación y aprendizaje en Oratoria Efectiva.
              </div>
            </details>

            <details className="group bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer">
              <summary className="font-bold text-lg text-white p-6 list-none flex justify-between items-center">
                ¿Cómo acceder al producto?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400">
                Inmediatamente después de confirmar tu pago, recibirás un correo electrónico de Hotmart con tus datos de acceso y el enlace directo para entrar a la plataforma de alumnos y ver los videos.
              </div>
            </details>

            <details className="group bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer">
              <summary className="font-bold text-lg text-white p-6 list-none flex justify-between items-center">
                ¿Cómo hago para comprar?
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-neutral-400">
                Solo debes hacer clic en cualquiera de los botones "COMPRAR AHORA" de esta página. Serás redirigido al formulario de pago seguro de Hotmart donde podrás elegir tu método de pago local y completar la transacción de manera encriptada.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-neutral-950 text-center border-t border-neutral-900">
        <p className="text-neutral-500 text-sm font-medium">
          Copyright &copy; {new Date().getFullYear()}<br/>
          Todos los derechos reservados.
        </p>
      </footer>

    </div>
  );
}
