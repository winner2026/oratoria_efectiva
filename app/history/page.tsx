import { prisma } from "@/infrastructure/db/client";
import HistoryView from "./HistoryView";
import { getOrCreateVisitorIdServer } from "@/lib/auth/visitorIdentity";
import { VoiceSessionStore } from "@/infrastructure/db/voiceSessionStore";

export default async function HistoryPage() {
  // Obtener la identidad del visitante garantizada por cookie firmada HttpOnly
  const { visitorId } = await getOrCreateVisitorIdServer();

  console.log(`[HISTORY] Fetching sessions for visitorId: ${visitorId}`);

  let serializedSessions: any[] = [];
  let videos: any[] = [];
  let books: any[] = [];

  try {
    // Obtener sesiones reales de la base de datos aisladas estrictamente por visitorId
    serializedSessions = await VoiceSessionStore.getSessionsByVisitor(visitorId);

    try {
      videos = await prisma.resource.findMany({
        where: { type: "VIDEO" },
        take: 6
      });

      books = await prisma.resource.findMany({
        where: { type: "BOOK" },
        take: 6
      });
    } catch (resourceErr) {
      // Ignore if resources table is empty in dev
    }
  } catch (err) {
    console.warn("[HISTORY] Database query error:", err);
  }

  return <HistoryView videos={videos} books={books} sessions={serializedSessions} />;
}
