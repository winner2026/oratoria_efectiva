# ADS Decision Policy v1.0
**Effective Date:** 2026-01-17
**Status:** ACTIVE

## 1. Principios Fundamentales
Este documento define los límites estrictos de lo que la Inteligencia Artificial (IA) puede y no puede decidir dentro del sistema de *Oratoria Efectiva*.

1. **La IA es un Intérprete, no un Juez.** La IA nunca define qué es "bueno" o "malo" por sí misma. Solo interpreta si los datos cumplen con reglas predefinidas por humanos.
2. **Determinismo sobre Probabilidad.** En caso de conflicto entre una métrica dura (ej. WPM) y una opinión de la IA, siempre prevalece la métrica dura.
3. **Seguridad ante Duda.** Si el sistema no tiene certeza suficiente, la decisión por defecto es "NO DECIDIR" (Non-Verdict), nunca adivinar.

---

## 2. Matriz de Decisión (Scope of Authority)

### ✅ Lo que la IA SÍ decide (Executor Role)
*   **Mapeo de Patrones:** Identificar si una combinación de métricas se parece a un arquetipo conocido (ej. "Monótono").
*   **Detección de Matices:** Encontrar sarcasmo o duda en el texto transcrito (siempre validado por tono).
*   **Recomendación de Protocolo:** Sugerir qué ejercicio de la base de datos pre-aprobada es el más relevante.

### ❌ Lo que la IA NUNCA decide (Forbidden Actions)
*   **Umbrales de Éxito:** La IA no puede decidir que "180 WPM ahora está bien". Eso lo define el Comité Académico.
*   **Diagnóstico Psicológico:** Prohibido inferir estados mentales (ej. "Pareces deprimido"). Solo se evalúan señales acústicas ("Energía baja").
*   **Scores Finales sin Supervisión:** Ningún score de Autoridad "HIGH" se otorga si existen contradicciones lógicas detectadas por el Critic.

---

## 3. Política de Persistencia y Auditoría
Cualquier decisión que afecte el score del usuario debe ser:
1.  **Inmutable:** Guardada en un registro WORM (Write Once Read Many).
2.  **Reproducible:** El input + reglas deben generar siempre el mismo output.
3.  **Transparente:** Hash criptográfico del output del LLM almacenado para evitar ediciones silenciosas.

---

## 4. Política de Riesgo (Risk Tolerance)
El sistema opera bajo perfiles de riesgo explícitos:
*   **CONSERVATIVE (B2B):** Prioriza minimizar Falsos Positivos. Mejor no dar un premio que darlo por error.
*   **AGGRESSIVE (Training):** Prioriza el feedback rápido. Tolera pequeños errores para fomentar la práctica.

---

## 5. Control de Cambios (Human Gate)
Ningún cambio en la lógica de decisión (umbrales, prompts, pesos) puede ir a producción sin:
1.  Evidencia estadística de mejora (Analysis Report).
2.  Aprobación explícita de un humano autorizado (Human Gate).
