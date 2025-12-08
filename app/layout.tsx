export const metadata = {
  title: "Registro de Gastos",
  description: "MicroSaaS de registro rápido",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
