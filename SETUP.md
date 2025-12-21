# Configuración de Oratoria Efectiva

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

### 1. OpenAI API Key (REQUERIDA)

La aplicación utiliza OpenAI para:
- Transcribir el audio con Whisper
- Generar feedback personalizado con GPT-4o-mini

**Cómo obtener tu API Key:**

1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la clave generada
5. Pégala en tu archivo `.env.local`:

OPENAI_API_KEY="sk-tu-clave-aqui"

## Instalación

1. Instala las dependencias:
npm install

2. Configura tu OPENAI_API_KEY en .env.local

3. Ejecuta el servidor de desarrollo:
npm run dev

4. Abre http://localhost:3000
