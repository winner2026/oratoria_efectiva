/**
 * Google Sheets Lead Capture Service
 * 
 * Centraliza el envío de prospectos (leads) recopilados en formularios de captura
 * (/regalos, /waitlist, newsletter, etc.) directamente hacia la hoja de cálculo:
 * https://docs.google.com/spreadsheets/d/12LFJWRC6inYWhmt5Sh_hsyLGN6h140irI43dcy-4NYw
 */

export interface LeadPayload {
  name: string;
  email: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface GoogleSheetsLeadResponse {
  success: boolean;
  error?: string;
  detail?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendLeadToGoogleSheets(lead: LeadPayload): Promise<GoogleSheetsLeadResponse> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    const errorMsg = 'GOOGLE_SHEETS_WEBHOOK_URL o GOOGLE_SHEETS_WEBHOOK_SECRET no están configuradas en las variables de entorno.';
    console.warn('[GoogleSheetsLeadService]', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }

  const normalizedName = (lead.name || 'Anónimo').trim().replace(/\s+/g, ' ');
  const normalizedEmail = (lead.email || '').trim().toLowerCase();
  const source = (lead.source || 'captura').trim();

  if (normalizedName.length < 2) {
    return {
      success: false,
      error: 'El nombre debe tener al menos 2 caracteres.',
    };
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return {
      success: false,
      error: 'El correo electrónico no es válido.',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: webhookSecret,
        name: normalizedName,
        email: normalizedEmail,
        source,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success !== true) {
      console.error(
        '[GoogleSheetsLeadService] Error devuelto por webhook:',
        response.status,
        result?.error || 'Respuesta inválida',
        result?.detail || ''
      );
      return {
        success: false,
        error: result?.error || 'Falló el registro en Google Sheets.',
        detail: result?.detail,
      };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error de conexión desconocido';
    console.error('[GoogleSheetsLeadService] Excepción al llamar al webhook:', message);
    return {
      success: false,
      error: message,
    };
  }
}
