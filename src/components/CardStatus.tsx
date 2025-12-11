export default function CardStatus({
  status,
  message,
}: {
  status: string;
  message: string;
}) {
  const colorMap: Record<string, string> = {
    OK: "bg-green-500",
    WAIT: "bg-yellow-500",
    PAY: "bg-orange-500",
    URGENT: "bg-red-600",
  };

  const labelMap: Record<string, string> = {
    OK: "Todo en orden",
    WAIT: "Esperá",
    PAY: "Conviene pagar",
    URGENT: "Pagá hoy",
  };

  return (
    <div className="p-5 rounded-xl shadow bg-white border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className={`w-6 h-6 rounded-full ${colorMap[status]}`} />

        <div>
          <p className="font-bold text-lg">{labelMap[status]}</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
