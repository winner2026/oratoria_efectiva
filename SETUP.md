# 🚀 Setup y Ejecución - Kredia MVP

## Verificar Estado del Proyecto

### 1. Verifica si el proyecto existe

Ejecuta en tu terminal:

```bash
dir "C:\Proyectos\Kredia MVP"
```

**Si ves archivos como `package.json`, `src/`, etc.** → El proyecto existe, ve a **Paso 2**

**Si dice "No se encuentra el archivo"** → El proyecto NO existe, ve a **Plan A**

---

## Plan A: Crear Proyecto Nuevo

Si el proyecto NO existe, necesitas inicializarlo:

### 1. Crear proyecto Next.js

```bash
cd C:\Proyectos
npx create-next-app@latest "Kredia MVP" --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Opciones a seleccionar:
- ✅ TypeScript? **Yes**
- ✅ ESLint? **Yes**
- ✅ Tailwind CSS? **Yes**
- ✅ `src/` directory? **Yes**
- ✅ App Router? **Yes**
- ✅ Customize import alias? **Yes** → `@/*`

### 2. Instalar dependencias adicionales

```bash
cd "C:\Proyectos\Kredia MVP"
npm install zod @neondatabase/serverless
```

### 3. Verificar estructura

```bash
dir src
```

Deberías ver:
- ✅ `/app` - Ya creado por Next.js
- ✅ `/core` - Ya lo creamos durante la sesión
- ✅ `/infrastructure` - Ya lo creamos
- ✅ `/utils` - Ya lo creamos
- ✅ `/types` - Ya lo creamos

---

## Plan B: Proyecto Existe

Si el proyecto YA existe:

### 1. Navegar al proyecto

```bash
cd "C:\Proyectos\Kredia MVP"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea el archivo `.env.local` en la raíz:

```env
DATABASE_URL=postgresql://username:password@host/database
```

*(Reemplaza con tu conexión real de NeonDB)*

### 4. Ejecutar migraciones

```bash
# Si tienes psql instalado:
psql $env:DATABASE_URL -f src/infrastructure/db/migrations/0001_init.sql

# O conéctate a NeonDB desde su dashboard y ejecuta el SQL manualmente
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre: http://localhost:3000

---

## Plan C: Buscar Proyecto en Otra Ubicación

Si no sabes dónde está el proyecto:

```bash
# Buscar package.json en todo el disco C:
dir C:\ /s /b | findstr package.json

# O buscar carpeta específica:
dir C:\ /s /b | findstr "Kredia"
```

---

## Verificaciones Post-Setup

### 1. Verificar que Next.js está corriendo

```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

### 2. Probar rutas principales

- `http://localhost:3000` → Página de inicio
- `http://localhost:3000/onboarding` → Configuración de tarjeta
- `http://localhost:3000/dashboard` → Dashboard (requiere cardId)

### 3. Verificar que no hay errores de TypeScript

```bash
npm run build
```

Si hay errores, revisa:
- Imports correctos
- Tipos bien definidos
- Paths alias configurados en `tsconfig.json`

---

## Troubleshooting

### Error: "Cannot find module '@/...'"

Verifica `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error: "Module not found: Can't resolve 'zod'"

```bash
npm install zod
```

### Error: "DATABASE_URL is not set"

Crea `.env.local` con tu conexión de NeonDB

### Error: Puerto 3000 en uso

```bash
# Cambiar puerto
npm run dev -- -p 3001
```

---

## Estructura de Archivos Esperada

```
Kredia MVP/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── createCreditCardAction.ts
│   │   │   ├── getDashboardDataAction.ts
│   │   │   └── addTransactionAction.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DebtSummary.tsx
│   │   │   │   ├── PaymentRecommendationBox.tsx
│   │   │   │   ├── ProjectionPreview.tsx
│   │   │   │   └── RecentTransactionsList.tsx
│   │   │   └── page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── core/
│   │   ├── entities/
│   │   ├── use-cases/
│   │   ├── domain-services/
│   │   ├── repositories/
│   │   └── errors.ts
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── client.ts
│   │   │   └── schema.ts
│   │   └── repositories/
│   ├── utils/
│   └── types/
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## Próximos Pasos Después del Setup

1. ✅ **Conectar a NeonDB** - Configurar `.env.local`
2. ✅ **Ejecutar migraciones** - Crear tablas
3. ✅ **Probar onboarding** - Crear primera tarjeta
4. ✅ **Verificar dashboard** - Ver cálculos reales
5. ✅ **Testing end-to-end** - Flujo completo

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start

# Linter
npm run lint

# TypeScript check
npx tsc --noEmit
```

---

Si encuentras algún error, revisa:
1. Node.js versión >= 18
2. npm versión >= 9
3. Todas las dependencias instaladas
4. Variables de entorno configuradas
5. Estructura de carpetas correcta

¿Necesitas ayuda? Comparte el error exacto y te ayudo a resolverlo.
