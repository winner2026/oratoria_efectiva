# Conectar el formulario Regalos con Google Sheets

La página `/regalos` recoge nombre y correo con consentimiento y muestra la guía solo cuando el registro se guarda correctamente. El script `scripts/google-sheets-leads.gs` añade cada registro a la hoja existente que indiques en `SPREADSHEET_ID`.

## 1. Crear el Web App de Apps Script

1. Abre [Google Apps Script](https://script.google.com/) con una cuenta que tenga permiso de edición en la hoja destino.
2. Crea un proyecto, copia el contenido de `scripts/google-sheets-leads.gs` y guarda.
3. En **Configuración del proyecto → Propiedades del script**, añade `WEBHOOK_SECRET` con un secreto aleatorio de al menos 32 bytes. El ID de la hoja compartida ya está configurado en el script; si quieres cambiarla en el futuro, añade `SPREADSHEET_ID` con el nuevo ID. Puedes generar el secreto desde la terminal del proyecto con:

   ```sh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Crea una implementación nueva de tipo **Aplicación web**, ejecutada como tu cuenta y accesible para **Cualquier persona**. El secreto protege el endpoint; no lo incluyas en la web ni lo compartas públicamente.
5. Autoriza el acceso de Apps Script a Google Sheets. El script usará la pestaña `Registros`; si no existe, la creará dentro de esa hoja.
6. Copia la URL de la aplicación web que termina en `/exec`.

## 2. Configurar la aplicación

Añade estas variables al entorno del servidor (por ejemplo, `.env.local` para desarrollo y las variables de entorno del hosting para producción):

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/ID_DE_IMPLEMENTACION/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=el_mismo_secreto_de_WEBHOOK_SECRET
```

Reinicia el servidor después de configurar las variables. El secreto solo se usa en el endpoint del servidor y no se envía al navegador.

## Datos guardados

La pestaña **Registros** de la hoja configurada guarda fecha y hora, nombre, correo electrónico y origen (`regalos`). El formulario no suscribe a la persona a envíos promocionales.
