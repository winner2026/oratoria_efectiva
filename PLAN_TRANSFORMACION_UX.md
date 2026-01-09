# Plan de Transformación: OratoriaEfectiva 2.0 (Edición "Santiago")

Este documento detalla la hoja de ruta para alinear la aplicación con el perfil de "Santiago" (Líder Invisibilizado) y resolver las fricciones de UX identificadas.

## 1. El Nuevo Flujo de Onboarding (El "Quick Win")
**Objetivo:** Demostrar valor tangible antes de pedir el registro. Eliminar la sensación de "auditoría" y reemplazarla por "optimización".

### Flujo Actual vs. Nuevo
*   🔴 **Actual:** Hero -> Rol -> Objetivo -> Grabar -> Análisis Fake -> Registro -> (Esperanza de valor).
*   🟢 **Nuevo (Bio-hacking Loop):**
    1.  **Hero:** Promesa de "Optimización de Impacto" (No "aprender a hablar").
    2.  **Input:** Graba tu presentación de 10s (Línea Base).
    3.  **Intervención:** La IA "detecta" tensión. -> **Ejercicio Guiado (30s):** "Suelta la mandíbula y respira en caja".
    4.  **Output:** Graba de nuevo (Versión Calibrada).
    5.  **Validación:** Player A (Antes) vs Player B (Después). "Escucha cómo ganaste profundidad".
    6.  **Conversión:** "¿Quieres mantener este nivel? Crea tu cuenta".

## 2. Ajustes de Copywriting (Lenguaje Ejecutivo)
Reemplazar términos educativos/médicos por términos de alto rendimiento.

| Contexto | Texto Viejo ❌ | Texto Nuevo (Santiago) ✅ |
| :--- | :--- | :--- |
| **Hero Title** | "Domina el arte de hablar en público" | "Optimiza tu Impacto Comunicativo con Biometría Vocal" |
| **SOS Button** | "Modo Emergencia / Preparación Flash" | "¿Reunión en 5 min? Calibración Express (Gratis)" |
| **Feedback** | "Tienes muchas muletillas" | "Detectamos interferencias en tu fluidez. Limpiemos la señal." |
| **Resultados** | "Tu nota es 70/100" | "Nivel de Autoridad Percibida: 70%. Potencial de mejora: Alto." |
| **Empatía** | (Inexistente) | "Tu hardware vocal es potente. Solo necesitamos ajustar el software (técnica)." |

## 3. Re-ingeniería del Modo SOS
*   **Visibilidad:** Mover el botón SOS fuera del footer o esquinas. Ponerlo como una alternativa clara en el Home: *"Quiero entrenar"* vs *"Tengo una crisis ahora"*.
*   **Gratuidad:** Etiquetarlo explícitamente como "Herramienta Gratuita de Acceso Inmediato". Esto baja las defensas de Santiago contra la "estafa administrativa".

## 4. Estrategia de "Menos Métricas, Más Significado"
*   **Ocultar el Score:** En la primera interacción, no mostrar "Score: 65". Mostrar: "Estabilidad: Mejorada".
*   **El Score como consecuencia:** "Tu voz suena más estable -> Esto ha elevado tu Índice de Autoridad al 75%".

## 5. Planes de Suscripción (Reframing)
*   **Plan Gratis:** De "Diagnóstico Básico" a **"Diagnóstico + Calibración Inicial"**.
*   **Plan Voz Pro:** De "100 análisis" a **"Entrenamiento de Hábito Diario"**.
*   **Plan Elite:** De "Video y Gestos" a **"Executive Presence Suite"**.

---

## Próximos Pasos (Técnicos)
1.  **Refactor `app/page.tsx`:** Implementar el "Bio-hacking Loop" con grabación doble (A/B testing propio).
2.  **Update `app/sos/page.tsx`:** Hacerlo accesible sin login (si no lo es) y ajustar copy.
3.  **Update `app/results/page.tsx`:** Priorizar texto cualitativo sobre gráficos de barras.
4.  **Detección de Nasalidad y Análisis Espectral:**
    *   *Estado:* No implementado (Solo Pitch/YIN actual).
    *   *Objetivo:* Implementar FFT para comparar energía en bandas 500-800Hz (Bucal) vs 2500Hz (Nasal).
    *   *Mitigación Actual:* Ejercicios de "Resonancia de Pecho" universales en Protocolo de 30 Días.
    *   *Acción:* Añadir flag de auto-diagnóstico en UI ("¿Te dicen que suenas gangoso? Activa módulo especial").
