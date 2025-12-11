export function krediaAdvice({
  statementDate,
  dueDate,
}: {
  statementDate: string;
  dueDate: string;
}) {
  const today = new Date();

  const afterStatement = today > new Date(statementDate);
  const daysToDue = (new Date(dueDate).getTime() - today.getTime()) / 86400000;

  if (!afterStatement) {
    return {
      status: "WAIT",
      message: "Aún no pasó el cierre. No pagues hoy.",
    };
  }

  if (daysToDue <= 0) {
    return {
      status: "URGENT",
      message: "Hoy es el último día. Pagá para evitar intereses.",
    };
  }

  if (daysToDue <= 3) {
    return {
      status: "PAY",
      message: "Faltan pocos días. Conviene pagar hoy.",
    };
  }

  return {
    status: "OK",
    message: "Todo bajo control. No hace falta pagar hoy.",
  };
}
