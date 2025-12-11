import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #ececec",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "white",
        zIndex: 30,
      }}
    >
      <Link
        href="/"
        style={{ fontWeight: 700, fontSize: 20, color: "black", textDecoration: "none" }}
      >
        Kredia PRO
      </Link>
      <div style={{ display: "flex", gap: 18 }}>
        <Link href="/onboarding" style={{ color: "#2c2c2c", textDecoration: "none" }}>
          Onboarding
        </Link>
        <Link href="/dashboard" style={{ color: "#2c2c2c", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link href="/auth/login" style={{ color: "#2c2c2c", textDecoration: "none" }}>
          Entrar
        </Link>
      </div>
    </nav>
  );
}
