import { redirect } from "next/navigation";

/**
 * Redirección de la pantalla de práctica heredada hacia el nuevo
 * Diagnóstico y Simulador de 15 Segundos en /voz_efectiva.
 */
export default function PracticeRedirect() {
  redirect("/voz_efectiva");
}
