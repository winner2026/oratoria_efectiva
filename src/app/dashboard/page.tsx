import { redirect } from "next/navigation";

interface DashboardPageProps {
  searchParams?: { cardId?: string | string[] };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const cardIdParam = searchParams?.cardId;
  const cardId = typeof cardIdParam === "string" ? cardIdParam : undefined;

  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!cardId || !uuidRegex.test(cardId)) {
    redirect("/onboarding");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify({ cardId }, null, 2)}</pre>
    </div>
  );
}

