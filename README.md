# Kredia MVP - La Verdad de tu Tarjeta

Aplicación MVP para gestión inteligente de tarjetas de crédito.

## 🎯 Propuesta de Valor

**"Ahora sí entiendes tu tarjeta"**

Kredia te muestra:
- Tu deuda real en tiempo real
- Cuánto pagar para evitar intereses
- Proyección de tu deuda el próximo mes
- Recomendaciones inteligentes basadas en tu situación

## 🏗️ Arquitectura

Clean Architecture + Next.js 15 + NeonDB

```
/src
  /app → UI + Server Actions
  /core → Lógica de negocio pura
    /entities → Modelos del dominio
    /use-cases → Motores de cálculo
    /domain-services → Servicios puros
    /repositories → Interfaces
  /infrastructure → BD + Implementaciones
  /utils → Helpers
  /types → Tipos compartidos
```

## 🚀 Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database
```

### 3. Inicializar base de datos

```bash
# Conectar a NeonDB
psql $DATABASE_URL -f src/infrastructure/db/migrations/0001_init.sql
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🧪 Flujo de Testing End-to-End

### Paso 1: Onboarding

1. Ve a `/onboarding`
2. Ingresa:
   - **Saldo actual**: 5600
   - **Fecha de corte**: (hoy + 2 días)
   - **Fecha límite de pago**: (hoy + 20 días)
3. Click en "Ver mi dashboard"

### Paso 2: Dashboard

Valida que muestra:
- ✅ Deuda actual: $5,600.00
- ✅ Pago mínimo: ~$224.00
- ✅ Intereses proyectados: calculados correctamente
- ✅ Recomendación de pago clara
- ✅ Nivel de urgencia correcto (según días restantes)
- ✅ Proyección del próximo mes

### Paso 3: Verificar Cálculos

**Cálculo de pago mínimo:**
```
max(5600 * 0.04, 200) = max(224, 200) = 224
```

**Cálculo de intereses:**
```
dailyRate = 0.07 / 30 = 0.00233
remaining = 5600 - 224 = 5376
daysRemaining = 20
interest = 5376 * 0.00233 * 20 ≈ 250.66
```

## 📊 Casos de Uso Implementados

### 1. `calculateCurrentDebt`
Motor base que analiza el estado actual de la deuda.

**Input:**
- Balance
- Fecha de corte
- Fecha límite de pago

**Output:**
- Deuda real
- Pago mínimo
- Intereses proyectados
- Días restantes
- Estado del ciclo

### 2. `calculatePaymentRecommendation`
Genera recomendaciones inteligentes de pago.

**Input:**
- Resultados de `calculateCurrentDebt`

**Output:**
- Pago recomendado
- Ahorro vs pago mínimo
- Mensaje personalizado
- Nivel de urgencia (low/medium/high)

### 3. `calculateProjection`
Proyecta la deuda del próximo mes.

**Input:**
- Deuda actual
- Monto de pago a simular
- Tasa de interés mensual

**Output:**
- Deuda proyectada
- Intereses generados
- Mensaje predictivo

### 4. `getDashboardData`
Orquestador que consolida todos los cálculos.

**Flujo:**
1. Obtiene tarjeta de BD
2. Obtiene transacciones
3. Ejecuta `calculateCurrentDebt`
4. Ejecuta `calculatePaymentRecommendation`
5. Ejecuta `calculateProjection` (con pago = 0)
6. Retorna todo consolidado

## 🎨 Componentes UI

### `DebtSummary`
Muestra la deuda actual con todos los detalles.

### `PaymentRecommendationBox`
Recomendación destacada con colores según urgencia.

### `ProjectionPreview`
Proyección del próximo mes si no se hace ningún pago.

### `RecentTransactionsList`
Últimas 10 transacciones registradas.

## 🔒 Reglas de Negocio

### Pago Mínimo
```typescript
max(balance * 0.04, 200)
```

### Tasa de Interés
- **Mensual**: 7% (default)
- **Diaria**: 0.07 / 30 = 0.00233

### Nivel de Urgencia
- **High**: días restantes <= 3
- **Medium**: días restantes <= 10
- **Low**: días restantes > 10

## 📁 Estructura de Base de Datos

### `credit_cards`
- id, name, balance
- statement_date, due_date
- interest_rate_monthly

### `transactions`
- id, credit_card_id
- amount, date, description
- type (NORMAL | MSI)

### `msi_plans`
- id, transaction_id
- total_amount, months
- monthly_payment, remaining_months

## 🚢 Checklist para Beta Privada

- [ ] Onboarding sin fricción
- [ ] Dashboard muestra cálculos correctos
- [ ] Formateo de moneda (MXN)
- [ ] Texto emocional agregado
- [ ] Colores de urgencia funcionando
- [ ] Sin errores en consola
- [ ] Transacciones funcionando (próximo paso)
- [ ] MSI tracking (próximo paso)

## 🎯 Próximos Pasos

1. ✅ Implementar casos de uso
2. ✅ Implementar orquestador
3. ⏳ Testing end-to-end completo
4. ⏳ Agregar transacciones manuales
5. ⏳ Implementar MSI tracking
6. ⏳ Beta privada con 3-5 usuarios

## 📝 Notas de Desarrollo

### Diseño Emocional (Donald Norman)

**Visceral** - Primera impresión
- UI limpia y profesional
- Colores suaves
- Espaciado generoso

**Behavioral** - Facilidad de uso
- Onboarding de 3 campos
- Sin fricción
- Validación automática

**Reflective** - Valor percibido
- "Ahora sí entiendes tu tarjeta"
- Recomendaciones claras
- Control sobre finanzas

### Clean Architecture

- **Dominio** (`/core`) - NO conoce la BD ni frameworks
- **Infraestructura** (`/infrastructure`) - Implementaciones técnicas
- **UI** (`/app`) - Next.js Server Components
- **Inversión de dependencias** - Interfaces en core, implementaciones en infra

---

Hecho con ❤️ para mexicanos que quieren entender sus tarjetas
