import { CalculatePaymentRecommendationOutput } from '@/core/use-cases/calculatePaymentRecommendation'

interface PaymentRecommendationBoxProps {
  data: CalculatePaymentRecommendationOutput
}

export function PaymentRecommendationBox({
  data
}: PaymentRecommendationBoxProps) {
  const urgencyColors = {
    low: 'bg-green-50 border-green-200 text-green-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    high: 'bg-red-50 border-red-200 text-red-900'
  }

  const urgencyBadgeColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <section
      className={`rounded-xl p-6 border ${urgencyColors[data.urgencyLevel]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recomendación de Pago</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            urgencyBadgeColors[data.urgencyLevel]
          }`}
        >
          {data.urgencyLevel === 'high' && 'Urgente'}
          {data.urgencyLevel === 'medium' && 'Importante'}
          {data.urgencyLevel === 'low' && 'Todo bien'}
        </span>
      </div>

      <p className="text-base leading-relaxed">{data.recommendedMessage}</p>

      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
        <p className="text-sm font-medium">
          Ahorro estimado:{' '}
          <span className="text-lg font-bold">
            ${data.savingsIfRecommended.toLocaleString()}
          </span>
        </p>
      </div>
    </section>
  )
}
