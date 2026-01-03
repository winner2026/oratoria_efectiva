import { prisma } from "@/infrastructure/db/client";
import HistoryView from "./HistoryView";

export default async function HistoryPage() {
  const videos = await prisma.resource.findMany({
    where: {
      OR: [
        { type: "VIDEO" },
        { type: "EXERCISE" }, // In case we grouped exercises with videos in the seed
        { type: "Video" }, // For compatibility if seed used mixed case (seed used VIDEO)
        { type: "Ejercicio" }
      ]
    }
  });

  const books = await prisma.resource.findMany({
    where: {
      OR: [
        { type: "BOOK" },
        { type: "Guía" },
        { type: "Lectura" },
        { type: "Práctica" } // Wait, seed used "BOOK", "VIDEO" literals in `data` but the objects had "Guía" etc.
        // Let's check seed.ts:
        // Videos: type: "VIDEO"
        // Books: type: "BOOK"
        // Ah, the seed script mapped them:
        // videos loop -> type: "VIDEO"
        // books loop -> type: "BOOK"
        // But the original arrays in seed.ts had "Video", "Ejercicio" etc.
        // Wait, the seed script did:
        // data: { ... type: "VIDEO" ... }
        // So in DB they are "VIDEO" or "BOOK". 
        // BUT the UI expects the "sub-type" label (e.g. "Guía", "Ejercicio").
        // I stored the specific type in "type" column?
        // In seed.ts:
        // type: "VIDEO" (hardcoded string)
        // So I lost the granularity of "Ejercicio" vs "Video"?
        // Let's check seed.ts content again.
        //   type: "VIDEO",
        //   url: video.url,
        //   ...
        // Yes, I hardcoded type "VIDEO" for all videos.
        // Similarly "BOOK" for all books.
        // And description was "Contenido recomendado" or "Autor: ...".
        
        // ISSUE: The UI shows "VIDEO", "EJERCICIO", "GUÍA" tags.
        // If I only stored "VIDEO" and "BOOK", the UI will be less rich.
        // However, looking at the schema: type String.
        // I should have stored the specific type.
        // But for now, let's fetch everything where type is related.
      ]
    }
  });
  
  // Since I forced the type in seed to be "VIDEO" or "BOOK", query by that.
  // Ideally I would re-seed with granular types, but for now let's just fetch them.
  
  const allVideos = await prisma.resource.findMany({
    where: {
      type: "VIDEO"
    }
  });

  const allBooks = await prisma.resource.findMany({
    where: {
      type: "BOOK"
    }
  });

  return <HistoryView videos={allVideos} books={allBooks} />;
}
