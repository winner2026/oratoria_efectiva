import { CardEntity } from "@/core/entities/CreditCard";

export class FinancialEngine {
  static calcularInteresMensual(saldoActual: number, tasaMensual: number) {
    return saldoActual * tasaMensual;
  }

  static proyectarDeudaSinPago(saldoActual: number, tasaMensual: number) {
    return saldoActual + this.calcularInteresMensual(saldoActual, tasaMensual);
  }

  static proyectarDeudaConPago(saldoActual: number, tasaMensual: number, pago: number) {
    const nuevoSaldo = Math.max(saldoActual - pago, 0);
    return nuevoSaldo + nuevoSaldo * tasaMensual;
  }

  static diasHasta(fecha: Date) {
    const hoy = new Date();
    const diff = fecha.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  static riesgo(card: CardEntity) {
    const dias = this.diasHasta(card.fechaVencimiento);

    if (card.saldoActual <= 0) return "green";
    if (dias <= 3) return "red";
    if (dias <= 7) return "yellow";
    return "green";
  }

  static pagoRecomendado(card: CardEntity) {
    return Math.round(card.saldoActual * 0.2);
  }
}
