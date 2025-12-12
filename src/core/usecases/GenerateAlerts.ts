import { CardRepository } from "@/core/repositories/CardRepository";
import { FinancialEngine } from "@/core/usecases/FinancialEngine";

export class GenerateAlerts {
  constructor(private cards: CardRepository) {}

  async execute(userId: string) {
    const card = await this.cards.findByUser(userId);
    if (!card) return [];

    const alerts: Array<{
      tipo: string;
      titulo: string;
      descripcion: string;
    }> = [];

    const diasVenc = FinancialEngine.diasHasta(card.fechaVencimiento);
    const interes = FinancialEngine.calcularInteresMensual(
      card.saldoActual,
      card.tasaMensual
    );
    const riesgo = FinancialEngine.riesgo(card);
    const recomendado = FinancialEngine.pagoRecomendado(card);

    if (diasVenc <= 5) {
      alerts.push({
        tipo: "vencimiento",
        titulo: "Tu vencimiento está cerca",
        descripcion: `Faltan ${diasVenc} días para evitar intereses.`,
      });
    }

    if (card.saldoActual > 0) {
      alerts.push({
        tipo: "ahorro",
        titulo: "Si pagas hoy, reduces tus intereses",
        descripcion: `Pagar ${recomendado} hoy puede reducir tus intereses del próximo mes.`,
      });
    }

    if (riesgo === "red") {
      alerts.push({
        tipo: "riesgo",
        titulo: "Alto riesgo de intereses",
        descripcion: "Tu vencimiento está muy cerca. Considera un pago inmediato.",
      });
    }

    if (interes > card.saldoActual * 0.15) {
      alerts.push({
        tipo: "interes",
        titulo: "Interés elevado detectado",
        descripcion: `Tus intereses son ${interes.toLocaleString()}, considera un pago estratégico.`,
      });
    }

    return alerts;
  }
}
