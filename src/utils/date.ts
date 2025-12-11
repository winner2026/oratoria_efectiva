export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatShortDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  } catch (error) {
    return dateString;
  }
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey() {
  return new Date().toISOString().slice(0, 7);
}
export function getMonthDays(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let daysArray: { number: number | ""; isToday: boolean }[] = [];

  for (let i = 0; i < firstDay; i++) {
    daysArray.push({ number: "", isToday: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push({
      number: d,
      isToday: d === date.getDate(),
    });
  }

  return daysArray;
}
