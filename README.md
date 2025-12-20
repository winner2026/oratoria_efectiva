# Oratoria Efectiva architecture

## Layers
- app/: Next.js UI + routing, no business logic.
- src/: Clean architecture core (domain, application, infrastructure, services, lib, types).
- public/: Static assets.
- scripts/: One-off technical utilities (seed, cleanup).
- tests/: Domain + application unit tests only.

## Notes for next phases
- Keep services/audio/* in services for the MVP; move any code that depends on external tooling to src/infrastructure/audio/* later if it becomes unstable.
- Current API routes are placed under app/api/analysis (use-case orchestrator) and app/api/voice (audio upload/raw audio). Document this intent before renaming them in the future.
- Tests only have the layer folders right now; plan to add at least one meaningful test per use case and one per critical metric as you progress.
