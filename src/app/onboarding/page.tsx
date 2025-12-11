import { createCreditCardAction } from '../actions/createCreditCardAction'
import { redirect } from 'next/navigation'

/**
 * ONBOARDING PAGE - Primera impresión del usuario
 *
 * Define:
 * - Conversión (¿completa el setup?)
 * - Retención (¿llega al dashboard?)
 * - Inicio del flywheel (datos → insights)
 *
 * Diseño Emocional (Donald Norman):
 * - Visceral: Ultra simple, 3 inputs máximo
 * - Behavioral: Facilidad absoluta, sin fricción
 * - Reflective: "Ahora tengo control de mi tarjeta"
 *
 * Arquitectura:
 * - Form nativo de HTML (sin JavaScript del lado del cliente)
 * - Server Action maneja la creación
 * - Validación con Zod en el servidor
 * - Redirección inmediata al dashboard
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Input({ label, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </span>
      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        {...props}
      />
    </label>
  )
}

export default function OnboardingPage() {
  async function handleSubmit(formData: FormData) {
    'use server'

    // Server Action crea la tarjeta y retorna el ID
    const { id } = await createCreditCardAction(formData)

    // Redirección inmediata al dashboard con el ID de la tarjeta
    redirect(`/dashboard?cardId=${id}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kredia
          </h1>
          <p className="text-gray-600">
            Configura tu tarjeta en 30 segundos
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Información de tu tarjeta
          </h2>

          <div className="space-y-5">
            {/* Saldo Actual */}
            <Input
              name="balance"
              label="Saldo actual"
              type="number"
              placeholder="5600"
              step="0.01"
              min="0"
              required
            />

            {/* Fecha de Corte */}
            <Input
              name="statementDate"
              label="Fecha de corte"
              type="date"
              required
            />

            {/* Fecha Límite de Pago */}
            <Input
              name="dueDate"
              label="Fecha límite de pago"
              type="date"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-8 bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Ver mi dashboard
          </button>

          {/* Info adicional */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Estos datos se usan solo para calcular tu deuda y recomendaciones
          </p>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            La Verdad de tu Tarjeta™
          </p>
        </div>
      </div>
    </main>
  )
}
