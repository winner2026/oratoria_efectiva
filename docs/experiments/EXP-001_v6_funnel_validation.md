# Bitácora de Experimento: EXP-001 — V6.2 Real User Conversion

## 1. Ficha del Experimento
- **Experimento ID:** EXP-001
- **Título:** Conversión de Tráfico de YouTube a Usuarios Activados mediante Diagnóstico de 60s
- **Fecha de Congelamiento:** 2026-10-08
- **Estado:** 🧊 CONGELADO / ESPERANDO TRÁFICO REAL DE YOUTUBE
- **Muestra Objetivo (Real User Cohort):** N = 10 a 30 usuarios reales (Etiqueta: *Early Product Signal*)
- **Regla de Rigor de Criterio:** Diferenciación estricta entre `FAIL del Criterio` (la versión actual no alcanza el umbral predefinido) y `REJECT del Producto` (el abandono de la hipótesis central).

---

## 2. Hipótesis Operativas Predefinidas ($H_0$)
* **Hipótesis Principal (Activación):** El diagnóstico gratuito de 60s sin fricción logrará un **ActivationRate $\ge$ 40%** ($\frac{\text{first\_missions\_completed}}{\text{diagnostics\_started}}$).
* **Hipótesis Secundaria (Retención Temprana):** El sistema logrará una **EarlyRetentionSignal $\ge$ 30%** (`SecondSessionRate`).

---

## 3. Verificación de Fixture de Pruebas (Test Fixture Documentation)

| Suite de Prueba | Fixture Input Metrics | Algoritmo y Pesos | Score Resultante | Explicación de Diferencia |
| :--- | :--- | :--- | :---: | :--- |
| **Suite 3 (verifyAllSystems)** | WPM: 178, Fillers: 6, Energy: 0.60 | 25% WPM, 25% Fillers, 25% Energy, 25% Pause | **67** | Fixture con 178 WPM y 6 muletillas. |
| **Suite 5 (v6FunnelAndTtv)** | WPM: 185, Fillers: 7, Energy: 0.85 | 25% WPM, 25% Fillers, 25% Energy, 25% Pause | **64** | Fixture más severo (185 WPM y 7 muletillas). |

> **Conclusión de Fixtures:** El algoritmo y las ponderaciones del `PerformanceEvaluator` permanecieron 100% constantes ($25\%$ por dimensión). La variación de 3 puntos refleja la mayor penalización por desviación del fixture (185 WPM vs 178 WPM).

---

## 4. Verificación de Producción (Production Freeze Checks)

- [x] **Identidad de Cohorte:** Cada evento se asocia con `userId`, `experimentId` (EXP-001), `source`, `campaign`, `content` y `device`.
- [x] **Timestamp Consistente:** Trazabilidad precisa en milisegundos para $t_0, t_1, t_2, t_3, t_4$.
- [x] **Sin Duplicación por Refresh:** Prevención de inflación artificial de eventos de inicio.
- [x] **Aislamiento Total de Pruebas:** Los datos de ejecuciones sintéticas en `tests/` están estrictamente separados de la base de datos de producción.

---

## 5. SEPARACIÓN RIGUROSA DE EVIDENCIA (SINTÉTICA VS REAL)

```text
─────────────────────────────────────────────────────────────
A. INFRASTRUCTURE EVIDENCE (SYNTHETIC COHORT TEST)
─────────────────────────────────────────────────────────────
  Propósito: Auditoría de compilación y lógica de percentiles
  Cohorte:   Sintética (N = 5)
  ERS:       50.0% (Simulación de software)
  TTV1 P50:  20.0s | P75: 27.0s (Prueba de sistema)
─────────────────────────────────────────────────────────────
B. PRODUCT EVIDENCE (EXP-001 REAL USER COHORT)
─────────────────────────────────────────────────────────────
  Propósito: Evidencia empírica de comportamiento humano real
  Tráfico:   YouTube CTA (Canal Oratoria Efectiva)
  Cohorte:   Pendiente Tráfico Real (N = 0)
  ERS:       --% (Pendiente Usuario Real #01)
  TTV1 P50:  --s | P75: --s (Pendiente Usuario Real #01)
─────────────────────────────────────────────────────────────
```

---

## 6. Matriz de Auditoría Multivectorial ($N = 10 \dots 30$ Usuarios Reales)

| Vector de Evaluación | Métrica Objetivo | Umbral Predefinido | 1. Resultado Observado | 2. Criterio Vector | 3. Acción de Ingeniería |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FUNNEL** | **ActivationRate** | $\ge 40\%$ | *Pendiente Tráfico Real* | [PASS / FAIL] | [KEEP / MODIFY] |
| **VALUE** | **TTV1 (P50 Mediana)** | $\le 20$s | *Pendiente Tráfico Real* | [PASS / FAIL] | [KEEP / MODIFY] |
| **VALUE** | **TTV3 (P50 Mediana)** | $\le 300$s | *Pendiente Tráfico Real* | [PASS / FAIL] | [KEEP / MODIFY] |
| **RETENTION** | **EarlyRetentionSignal**| $\ge 30\%$ | *Pendiente Tráfico Real* | [PASS / FAIL] | [KEEP / MODIFY] |

---

## 7. Incidencia Técnica Registrada y Criterios de Aceptación V7 (Post-EXP-001)

### 🚨 Incidencia de Desconexión UI en Diagnóstico (`INC-001`)
- **Descripción:** Se identificó que la interfaz en `/diagnostico` ejecutaba un temporizador visual de 15s con spinner (`isAnalyzing`), pero la función `finishRecording()` realizaba `router.push('/listen')` sin enviar la muestra de audio vía `FormData` a `POST /api/analysis`.
- **Causa Raíz:** El componente de captura en `/diagnostico` actuaba como simulador visual (mock UI) sin integrar la invocación asíncrona del backend bioacústico.
- **Consecuencia en UI:** Al no procesarse el audio, el repositorio mantenía `lastDiagnostic === null`, forzando a `/listen` a renderizar el fallback por defecto (`50`, `Mantenimiento de Autoridad`, `Pausa de Autoridad`).
- **Advertencia Metodológica para EXP-001:** Cualquier iteración donde la interfaz no enviara la muestra de audio al backend **NO se computará como evidencia de eficacia o ineficacia del diagnóstico bioacústico**.

### ⚠️ Precisiones de Ingeniería Rigurosas
1. **Diferenciación entre Pruebas de Dominio y Éxito de Producto:** El éxito en las 7 suites de pruebas del motor respalda los escenarios sintéticos ejecutados en backend, pero **NO demuestra que el flujo público de diagnóstico en frontend funcione de extremo a extremo**.
2. **Criterio Estricto de Estado Vacío vs Error:** El estado pendiente (`-- / 100`) aplica **únicamente cuando no existe un diagnóstico válido y persistido**. Ante una grabación enviada que falle por red, corrupción o timeout del backend, **SE REQUIERE UN ESTADO DE ERROR RECUPERABLE ESPECÍFICO**, impidiendo terminantemente presentar un diagnóstico inventado o un fallback silencioso.

### 📋 Secuencia de Aceptación y Rutas de Prueba V7 (Post-EXP-001)
- **Ruta Positiva (Flujo Exitoso):**
  `Grabar audio → Enviar al backend → Analizar bioacústica → Persistir resultado → Mostrar diagnóstico real → Recargar página → Recuperar el mismo diagnóstico`
- **Ruta Negativa (Manejo de Errores):**
  `Grabar audio → Fallo de red / API → Mostrar mensaje de error recuperable con reintento → NO presentar diagnóstico ficticio ni fallback 50`

> **Principio Central de Ingeniería:** El producto no se valida porque la pantalla se vea convincente. Primero debe demostrar que procesa la voz real, genera un resultado trazable y lo conserva. Posteriormente se evaluará si ese resultado aporta el valor necesario para activar a los usuarios.

---

## 8. Arquitectura y Hoja de Ruta V7 (Post-EXP-001)

### 🏗️ Diagrama de Arquitectura Objetivo (V7)

```text
  [ Navegador Cliente ]
       │  (Cookie HttpOnly: visitor_id UUID v4)
       ▼
 ┌───────────────┐        FormData (Blob Audio)        ┌─────────────────────┐
 │ /diagnostico  │ ──────────────────────────────────> │ POST /api/analysis  │
 └───────────────┘                                     └──────────┬──────────┘
                                                                  │
                                                        Procesamiento Bioacústico
                                                        y Cálculo de Diagnóstico
                                                                  │
                                                                  ▼
 ┌───────────────┐       Lectura por visitor_id        ┌─────────────────────┐
 │   /history    │ <────────────────────────────────── │   PostgreSQL DB     │
 └───────────────┘                                     │  (voice_sessions)   │
                                                       └──────────┬──────────┘
 ┌───────────────┐       Lectura por visitor_id                   │
 │    /listen    │ <──────────────────────────────────────────────┘
 └───────────────┘
```

### 🔒 Especificación de Cookie `visitor_id`
- **Generación:** UUID v4 aleatorio generado en servidor (sin derivar de IP/UA para evitar colisiones en redes NAT/Wi-Fi compartidas y proteger privacidad).
- **Seguridad:** Cookie `HttpOnly`, `Secure` (en producción), `SameSite=Lax`.
- **Aislamiento:** Las consultas SQL/Prisma filtran estrictamente por el `visitor_id` autenticado en la sesión, impidiendo que un usuario acceda al historial de otro.

### 🎯 Evaluación de Progreso por Habilidad (No solo Puntuación Global)
Para V7, el análisis longitudinal entre sesiones comparará:
1. **Índice Global:** Resumen orientativo de autoridad (0 a 100).
2. **Métrica Objetivo Específica:** Por ejemplo, conteo de muletillas por minuto ajustado por duración de muestra.
3. **Cambio Observado:** Diferencia real cuantitativa ($\Delta$) en la métrica fuente.
4. **Hito Alcanzado:** Verificación de que la meta específica de la habilidad se cumplió (no solo un cambio de prioridad de cuello de botella).
5. **Confianza:** Evidencia suficiente para descartar variación aleatoria o ruido de medición.

### 📊 Matriz de Criterios de Aceptación para V7

| Escenario de Prueba | Condición y Entrada | Resultado Exigido | Estado |
| :--- | :--- | :--- | :---: |
| **Prueba 1: Muestra Anónima** | Visitante anónimo graba audio en `/diagnostico` | Se inserta una fila real vinculada al `visitor_id` en `voice_sessions`. | *Pendiente V7* |
| **Prueba 2: Lectura Historial** | Se recarga `/history` | Se recuperan las sesiones previas del mismo `visitor_id`. | *Pendiente V7* |
| **Prueba 3: Persistencia Dashboard** | Se recarga `/listen` | Se renderiza el último diagnóstico válido y persistido del `visitor_id`. | *Pendiente V7* |
| **Prueba 4: Aislamiento Multiusuario** | Dos navegadores realizan diagnósticos independientes | Sus historiales permanecen 100% aislados e inaccesibles entre sí. | *Pendiente V7* |
| **Prueba 5: Ruta Negativa (API Fail)** | Falla la red o la API de análisis | Se muestra un error recuperable explícito con reintento; **NO se genera diagnóstico ficticio ni fallback 50**. | *Pendiente V7* |
| **Prueba 6: Evaluación de Habilidad** | Se comparan dos muestras del mismo usuario | Se evalúa el progreso sobre la métrica específica objetivo (ej. muletillas/min), no solo sobre el score global. | *Pendiente V7* |

---

### 🛡️ Tres Controles de Refuerzo para V7
1. **Transacciones y Errores de Persistencia:** Si el análisis bioacústico concluye exitosamente pero falla la transacción en PostgreSQL, la aplicación NO afirmará que el historial fue guardado. Informará del estado real y ofrecerá una vía de recuperación explícita (reintento de guardado).
2. **Trazabilidad del Progreso Longitudinal:** Cada evaluación registrará explícitamente las claves `previousSessionId`, `currentSessionId`, métrica objetivo (ej. `fillersPerMinute`), unidad y criterio del hito. Un cambio de score global no se interpretará automáticamente como avance de habilidad.
3. **Identidad y Privacidad en Servidor:** El `visitor_id` se generará y validará estrictamente en el servidor (HTTP Cookie Handler). Las API Routes rechazarán cualquier identificador arbitrario inyectado en el cuerpo de la petición.

### 🏁 Criterio de Salida Institucional (V7 Exit Criterion)
> **CRITERIO DE SALIDA V7:** *Cada diagnóstico mostrado al usuario debe proceder de una grabación de voz real procesada, estar vinculado al visitor_id autenticado en servidor, quedar persistido en PostgreSQL y poder recuperarse tras cualquier recarga (F5); si algún paso falla, el sistema lo informará de manera explícita y recuperable.*

### 🚀 Secuencia de Ejecución Aprobada para V7 (`feat/v7-verifiable-coach`)
1. **Identidad Gestionada en Servidor:** Cookie firmada `visitor_id` (UUID v4 aleatorio, HttpOnly, SameSite=Lax). *(COMPLETADO Y VERIFICADO)*
2. **Conexión de Audio Real & Persistencia:** Conectar grabador WebAudio con `POST /api/analysis` e insertar en PostgreSQL `voice_sessions` sin omitir usuarios anónimos.
3. **Consolidación de Lectura & Recuperación:** Endpoints `GET /api/sessions/latest` y `GET /api/sessions` consumidos por `/listen` y `/history`.
4. **Manejo de Errores e Integridad:** UI de error recuperable ante fallos de red/DB, previniendo diagnósticos ficticios.
5. **Evaluación Longitudinal por Habilidad:** Comparación de deltas reales ($\Delta$) sobre métricas fuente específicas (`GET /api/sessions/compare`).
6. **Validación de Conversión E2E:** Verificación del circuito completo desde `/vocalgym` hasta `/history`.

---

## 9. Contrato del Circuito Unificado de Entrenamiento (V7 Target Blueprint)

### 🔄 Diagrama del Circuito Coconectado de 5 Pantallas

```text
  [ / ] Entry Point
   │ (Redirige a /vocalgym o muestra Dashboard si ya existe visitor_id con sesiones)
   ▼
 ┌───────────────┐        CTA "Analizar mi voz gratis"        ┌───────────────┐
 │  /vocalgym    │ ─────────────────────────────────────────> │  /diagnostico │
 └───────────────┘                                            └───────┬───────┘
                                                                      │
                                                           Graba Audio Real + FormData
                                                                      │
                                                                      ▼
 ┌───────────────┐       Recupera último diagnóstico          ┌─────────────────────┐
 │   /listen     │ <───────────────────────────────────────── │ POST /api/analysis  │
 └───────┬───────┘                                            └──────────┬──────────┘
         │                                                               │
         ├─── CTA "Ver evolución completa" ──> ┌───────────────┐         │ Persiste en DB
         │                                    │   /history    │ <───────┘ (voice_sessions)
         └─── CTA "Comprobar mejora" ────────> └───────────────┘
```

### 📜 Contrato de APIs Propuesto para V7
- **`POST /api/analysis`**: Recibe `audio/wav` en FormData, verifica `visitor_id` en cookie firmada, realiza análisis bioacústico, calcula diagnóstico y **persiste en PostgreSQL (`voice_sessions`)**.
- **`GET /api/sessions/latest`**: Devuelve el diagnóstico más reciente persistido para el `visitor_id` activo. Si no existe, devuelve `{ hasDiagnostic: false }` para renderizar el Estado Vacío (`-- / 100`).
- **`GET /api/sessions`**: Devuelve el historial cronológico de sesiones persistidas para `/history`.
- **`GET /api/sessions/compare?s1=UUID&s2=UUID`**: Compara dos sesiones específicas y calcula la variación cuantitativa de la métrica objetivo por habilidad.

### 🛡️ Las 5 Reglas Inviolables de Ingeniería
1. **Una sola identidad coherente:** El servidor asigna y valida la cookie firmada `visitor_id`. El cliente no puede elegir su ID.
2. **Una sola fuente de verdad:** El diagnóstico de `/listen` procede 100% de la tabla `voice_sessions`. Prohibido el uso de fallbacks simulados o `setTimeout`.
3. **Persistencia tras recarga:** `/history` y `/listen` consultan PostgreSQL; no dependen de `localStorage` ni del estado en memoria del navegador.
4. **Errores explícitos y visibles:** Si falla la API o la base de datos, la UI informa el error y ofrece reintento. Nunca genera diagnósticos ficticios.
5. **Evolución medida por habilidad:** El progreso evalúa métricas fuente específicas (ej. muletillas/min), no solo variaciones del score global.

---

### 🛡️ Regla de Criterio de Ingeniería del Proyecto
> **REGLA DE TRAZABILIDAD:** *Cada dato mostrado al usuario en cualquier pantalla de la aplicación debe poder rastrearse hasta su origen, su fecha de captura y la sesión que lo produjo.*

