import { prisma } from "@/infrastructure/db/client";
import HistoryView from "./HistoryView";
import { headers } from "next/headers";
import { 
  getClientIP, 
  normalizeUserAgent, 
  generateFingerprint 
} from "@/lib/fingerprint/generateFingerprint";

export default async function HistoryPage() {
  const headersList = await headers();
  
  // Generar fingerprint en el servidor para identificar al usuario de forma anónima
  const ip = getClientIP(headersList);
  const userAgent = normalizeUserAgent(headersList.get('user-agent'));
  const fingerprint = generateFingerprint(null, ip, userAgent);

  console.log(`[HISTORY] Fetching sessions for fingerprint: ${fingerprint}`);

  // Obtener sesiones reales de la base de datos
  const sessions = await prisma.voiceSession.findMany({
    where: {
      userId: fingerprint
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 15
  });

  // Convertir Decimal de Prisma a Number para evitar problemas de serialización
  const serializedSessions = sessions.map(s => ({
    ...s,
    avgPauseDuration: Number(s.avgPauseDuration),
    pitchVariation: Number(s.pitchVariation),
    energyStability: Number(s.energyStability),
    durationSeconds: Number(s.durationSeconds),
    createdAt: s.createdAt.toISOString()
  }));

  const videos = await prisma.resource.findMany({
    where: {
      type: "VIDEO"
    },
    take: 6
  });

  const books = await prisma.resource.findMany({
    where: {
      type: "BOOK"
    },
    take: 6
  });

  return <HistoryView videos={videos} books={books} sessions={serializedSessions as any} />;
}
