---
name: AuthoritySignalCalibrationSkill
description: Sistema híbrido de calibración de señales de autoridad vocal (ADS). Reemplaza el juicio humano micro-recurrente.
---

# AuthoritySignalCalibrationSkill (ADS)

## 1️⃣ Human Replacement Test (explícito)
**Humano sustituido (parcial):**
- **Rol:** Coach de comunicación ejecutiva senior
- **Costo:** 100–200 USD/hora
- **Frecuencia:** feedback en cada sesión / ejercicio
- **Costo del error:** pérdida de autoridad percibida, bajo impacto comunicativo

👉 **La skill reemplaza el juicio micro-recurrente del coach sobre señales vocales de autoridad.**

## 2️⃣ Tipo de sistema (clasificación ADS)
**Sistema HÍBRIDO (obligatorio)**

- **Métricas** → deterministas
- **Interpretación** → LLM acotado
- **Decisión final** → reglas + umbrales
- **Capacidad explícita de NO DECIDIR**

🚫 No agente autónomo
🚫 No scoring mágico
✅ Pipeline auditado

## 3️⃣ Responsabilidad de la Skill (scope exacto)

**La skill NO:**
- motiva
- enseña teoría
- improvisa feedback creativo

**La skill SÍ:**
- calibra señales de autoridad vocal
- valida si una muestra permite decisión
- emite diagnóstico estructurado
- decide si escalar a humano (HITL)

## 4️⃣ Inputs (schema obligatorio)
```json
{
  "audio_sample_id": "string",
  "transcript": "string",
  "metrics": {
    "wpm": "number",
    "pause_ratio": "number",
    "filler_rate": "number",
    "pitch_variance": "number",
    "energy_stability": "number"
  },
  "user_context": {
    "experience_level": "junior | mid | senior | executive",
    "language": "es",
    "use_case": "presentation | sales | leadership | interview"
  }
}
```
⚠️ **Si falta una métrica crítica → abort decision.**

## 5️⃣ Reglas deterministas (NO NEGOCIABLE)
Antes de llamar al LLM:

```typescript
IF transcript.length < 20 words → decision_allowed = false
IF audio_duration < 8s → decision_allowed = false
IF metrics.wpm == null → decision_allowed = false
IF metrics.pitch_variance == null → decision_allowed = false
```
👉 **Esto elimina el 80% de alucinaciones.**

## 6️⃣ Rol del LLM (muy limitado)
**Rol exacto**
> “Eres un analista de performance vocal ejecutiva. No motivas. No das consejos genéricos. Solo interpretas métricas dentro de rangos definidos.”

**Autoridad del LLM**
❌ No puede redefinir umbrales
❌ No puede inventar causas no observables
✅ Puede mapear métricas → patrones conocidos
✅ Puede explicar impacto ejecutivo

## 7️⃣ Umbrales de Autoridad (ejemplo inicial)
```json
{
  "wpm": { "optimal": [110, 150] },
  "pause_ratio": { "optimal": [0.15, 0.30] },
  "filler_rate": { "max": 0.05 },
  "pitch_variance": { "min": 20 },
  "energy_stability": { "min": 0.7 }
}
```
Estos valores viven en `step5_rules` (código), no en el prompt.

## 8️⃣ Output (único formato válido)
```json
{
  "decision_allowed": true,
  "confidence": "high | medium | low",
  "authority_score": "LOW | MEDIUM | HIGH",
  "signal_breakdown": {
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "risk_flags": [
    "UPWARD_INFLECTION",
    "MONOTONE",
    "RUSHING",
    "LOW_ENERGY"
  ],
  "recommended_protocol": [
    "BREATHING_SSSS",
    "POWER_STATEMENT",
    "PAUSE_CONTROL"
  ],
  "hitl_required": false
}
```

## 9️⃣ Arquitectura interna (obligatoria)
1. **Planner**: decide si el audio califica
2. **Executor**: normaliza métricas + llama LLM
3. **Critic / Auditor**: valida coherencia score vs métricas, detecta contradicciones, puede degradar confidence
4. **Memory**: guarda (metrics → score → outcome)

📌 **Sin Critic → NO deploy**
📌 **Sin Memory → NO mejora**

## 🔟 Métricas de evaluación de la Skill
- Hallucination: 0%
- Compliance error: 0%
- Falsos positivos: < 5%
- Falsos negativos: < 1%
- HITL escalation: 5–15%
- Latencia: < 2s

## 1️⃣1️⃣ Dónde encaja en tu app
Se ejecuta en:
- Análisis de Voz
- Gimnasio Vocal
- Modo SOS
Consume métricas existentes. Produce decisiones accionables, no texto bonito.
