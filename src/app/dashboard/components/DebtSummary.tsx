import { CalculateCurrentDebtOutput } from '@/core/use-cases/calculateCurrentDebt'
import { formatCurrency } from '@/utils/formatters'

interface DebtSummaryProps {
  data: CalculateCurrentDebtOutput
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export function DebtSummary({ data }: DebtSummaryProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Tu Deuda Hoy
      </h2>
      <p className="text-sm text-gray-500 mb-4 italic">
        Ahora sí entiendes tu tarjeta
      </p>

      <div className="space-y-1">
        <Row label="Deuda actual" value={formatCurrency(data.realDebt)} />
        <Row
          label="Pago sin intereses"
          value={formatCurrency(data.noInterestPayment)}
        />
        <Row
          label="Pago mínimo"
          value={formatCurrency(data.minimumPayment)}
        />
        <Row
          label="Intereses si pagas mínimo"
          value={formatCurrency(data.interestIfMinPayment)}
        />
        <Row label="Días restantes" value={`${data.daysRemaining} días`} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Estado del ciclo</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              data.cycleStatus === 'before_cutoff'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {data.cycleStatus === 'before_cutoff'
              ? 'Antes del corte'
              : 'Después del corte'}
          </span>
        </div>
      </div>
    </section>
  )
}
