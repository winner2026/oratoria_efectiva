"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("Iniciando sesion...");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("Sesion iniciada (mock)");
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 75px)",
        padding: "60px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 32,
          borderRadius: 18,
          border: "1px solid #eeeeee",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Iniciar sesion</h1>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #ccc" }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "14px 20px",
            background: "black",
            color: "white",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continuar
        </button>
        <div style={{ fontSize: 14 }}>
          Nuevo por aqui? <Link href="/auth/register" style={{ color: "#1f6feb" }}>Crear cuenta</Link>
        </div>
        {status && <p style={{ margin: 0, opacity: 0.8 }}>{status}</p>}
      </form>
    </div>
  );
}
