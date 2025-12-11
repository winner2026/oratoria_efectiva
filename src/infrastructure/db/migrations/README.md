# Migraciones de Base de Datos

## Instrucciones de uso

### 1. Conectarse a NeonDB

```bash
# Asegúrate de tener DATABASE_URL en tu .env
DATABASE_URL=postgresql://user:password@host/database
```

### 2. Ejecutar migración inicial

```bash
# Opción A: Usando psql
psql $DATABASE_URL -f src/infrastructure/db/migrations/0001_init.sql

# Opción B: Usando el cliente de Neon
neonctl sql < src/infrastructure/db/migrations/0001_init.sql
```

### 3. Verificar tablas creadas

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

## Estructura de migraciones

- `0001_init.sql` - Schema inicial (credit_cards, transactions, msi_plans)
- Las migraciones futuras seguirán el patrón: `XXXX_descripcion.sql`

## Rollback

Para revertir la migración inicial:

```sql
DROP TABLE IF EXISTS msi_plans CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS credit_cards CASCADE;
```

## Notas importantes

- Las migraciones usan `IF NOT EXISTS` para ser idempotentes
- `ON DELETE CASCADE` asegura integridad referencial
- Índices optimizan las queries más frecuentes
- NUMERIC(12,2) garantiza precisión financiera
