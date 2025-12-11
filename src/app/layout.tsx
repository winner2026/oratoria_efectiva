import './globals.css'

export const metadata = {
  title: 'Kredia MVP',
  description: 'Gestión inteligente de tarjetas de crédito',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
