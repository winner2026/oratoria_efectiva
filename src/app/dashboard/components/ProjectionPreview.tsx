import { CalculateProjectionOutput } from '@/core/use-cases/calculateProjection'

interface ProjectionPreviewProps {
  data: CalculateProjectionOutput
}

export function ProjectionPreview({ data }: ProjectionPreviewProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Proyección del Próximo Mes
      </h2>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Si no haces ningún pago hoy
          </p>
          <p className="text-2xl font-bold text-gray-900">
            ${data.projectedDebtNextMonth.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Deuda proyectada</p>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Intereses generados</span>
            <span className="font-semibold text-red-600">
              +${data.interestCharged.toLocaleString()}
            </span>
          </div>

          {data.msiMonthlyTotal > 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Cuotas MSI</span>
              <span className="font-semibold text-blue-600">
                +${data.msiMonthlyTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 italic">{data.message}</p>
      </div>
    </section>
  )
}
