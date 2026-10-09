import { NextRequest } from 'next/server';
import { processVisitorIdentityMiddleware } from '@/lib/auth/visitorIdentity';

export default function middleware(req: NextRequest) {
  const { response } = processVisitorIdentityMiddleware(req);
  return response;
}

export const config = { 
  matcher: [
    /*
     * Intercepta todas las rutas excepto recursos estáticos e imágenes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
