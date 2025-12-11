import { Transaction } from '@/core/entities/Transaction'

interface RecentTransactionsListProps {
  items: Transaction[]
}

export function RecentTransactionsList({
  items
}: RecentTransactionsListProps) {
  if (items.length === 0) {
    return (
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Transacciones Recientes
        </h2>
        <p className="text-gray-500 text-center py-8">
          No hay transacciones registradas aún
        </p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Transacciones Recientes
      </h2>

      <ul className="space-y-3">
        {items.map((transaction) => (
          <li
            key={transaction.id}
            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {transaction.description || 'Compra'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(transaction.date).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="text-right ml-4">
              <p className="font-semibold text-gray-900">
                ${transaction.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {transaction.type === 'MSI' ? 'MSI' : 'Normal'}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {items.length >= 10 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las transacciones →
          </button>
        </div>
      )}
    </section>
  )
}
