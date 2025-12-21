# Guía de Prueba del Flujo Completo

## Estado Actual

✅ El proyecto está configurado con **MODO MOCK** automático
✅ Funciona sin necesidad de OPENAI_API_KEY para probar
✅ Logs detallados en consola para debugging

## Cómo Probar el Flujo

### 1. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

### 2. Verificar Pantalla 1 (Landing)

- ✅ Debes ver el copy: "Hola. Vamos a escuchar tu voz con atención"
- ✅ Botón "Analizar mi voz"
- ✅ Click → navega a /practice

### 3. Verificar Pantalla 2 (Grabación)

**Abrir DevTools (F12) → Pestaña Console**

1. Click en "Iniciar grabación"
2. Permitir acceso al micrófono si el navegador lo solicita
3. Hablar durante 10-20 segundos
4. Click en "Detener grabación"

**Verificaciones en consola:**

```
✓ Debes ver el reproductor de audio
✓ Puedes escuchar tu grabación
```

5. Click en "Analizar"

**Verificaciones en consola:**

```
Audio blob: Blob { size: 120000, type: 'audio/webm' } Size: 120000 bytes
Enviando audio al servidor...
Respuesta del servidor: 200
Resultado del análisis: { success: true, data: {...} }
```

**En la terminal del servidor:**

```
[ANALYSIS] Received request
[ANALYSIS] ✓ Audio file: voice.webm 120000 bytes
[ANALYSIS] ⚠️  Usando respuesta MOCK (no hay OPENAI_API_KEY)
```

### 4. Verificar Pantalla 3 (Resultados)

Automáticamente navega a /results

- ✅ Muestra "Nivel de autoridad: Media (65/100)"
- ✅ Muestra diagnóstico
- ✅ Muestra transcripción (mensaje de prueba)
- ✅ Muestra fortalezas (2 items)
- ✅ Muestra debilidades (1 item)
- ✅ Muestra recomendación para "Hoy"
- ✅ Botones "Nuevo análisis" y "Inicio"

## Problemas Comunes y Soluciones

### ❌ "No se pudo acceder al micrófono"

**Solución:**
- Chrome: Click en el candado → Micrófono → Permitir
- Recarga la página

### ❌ "El audio está vacío"

**Verifica en consola del navegador:**

```js
Audio blob: Blob { size: 0 }  // ❌ MALO
```

**Causa:** El grabador no está capturando audio

**Solución:**
1. Verifica que el micrófono funcione (prueba en otra app)
2. Usa Chrome/Edge (mejor compatibilidad con MediaRecorder)
3. Habla MÁS FUERTE durante la grabación

### ❌ Error 400 "No se recibió audio"

**Verifica en Network (DevTools):**
- Request debe tener Content-Type: multipart/form-data
- Payload debe contener el archivo

**Solución:**
- El código ya está correcto, no deberías ver este error

### ❌ Error 500

**Verifica logs del servidor (terminal):**

```
[ANALYSIS] ❌ Error: ...
```

**Solución:**
- Copia el error completo
- Si es sobre OPENAI_API_KEY y quieres análisis real, configúrala en .env.local

## Activar Análisis Real con OpenAI

1. Obtén una API key: https://platform.openai.com/api-keys

2. Agrégala a .env.local:

```bash
OPENAI_API_KEY="sk-tu-clave-aqui"
```

3. Reinicia el servidor:

```bash
# Ctrl+C para detener
npm run dev
```

4. Ahora los análisis usarán:
   - Whisper para transcribir
   - GPT-4o-mini para feedback personalizado

**Logs esperados:**

```
[ANALYSIS] 🔄 Starting real analysis...
[ANALYSIS] Analyzing voice...
[ANALYSIS] Getting user...
[ANALYSIS] Generating feedback...
[ANALYSIS] ✓ Analysis complete!
```

## Flujo Completo Esperado

```
1. Usuario en / → "Analizar mi voz"
   ↓
2. /practice → Graba → "Analizar"
   ↓ (POST /api/analysis)
3. Servidor → MOCK o análisis real
   ↓
4. /results → Muestra análisis
```

## Checklist de Verificación

- [ ] Pantalla 1 se carga correctamente
- [ ] Navegación a /practice funciona
- [ ] Puede grabar audio (micrófono funciona)
- [ ] Puede escuchar la grabación
- [ ] Click en "Analizar" muestra logs correctos
- [ ] Navega a /results automáticamente
- [ ] Pantalla de resultados muestra datos correctos
- [ ] Puede hacer "Nuevo análisis"
- [ ] Puede volver a "Inicio"

Si todos los checks pasan, ✅ **el flujo funciona correctamente**.
