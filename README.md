# SEMTRA Backend

Este es el backend para el proyecto SEMTRA.

## Descripción

[Agrega aquí una breve descripción del proyecto, qué hace y cuál es su propósito.]

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   Node.js v22.14.0 (esa usé yo, probablemente sirvan anteriores).
*   Gestor de paquetes npm.
*   **PostgreSQL**: Una instancia de base de datos PostgreSQL en ejecución. Deberás configurar la cadena de conexión en el archivo de configuración del proyecto.
*   **Redis**: Una instancia de Redis en ejecución. Deberás configurar los detalles de conexión en el archivo de configuración del proyecto.

Tambien necesita configurar lo siguiente:
*   Registro de la aplicación en los servidores azure para usar protocolo oAuth 2.0 (endpoint de callback '/microsoft/callback').
*   Almacenamiento Azure Blob Storage.
*   Cuenta gmail configurada para enviar correos con aplicaciones externas.

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    # Usando npm
    npm install

3.  Configura las variables de entorno:
    *   Crea un archivo `.env` en la raíz del proyecto
    ```bash
    PORT=
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    DB_DIALECT=
    DB_PORT=
    OUTLOOK_CLIENT_ID=
    OUTLOOK_CLIENT_SECRET=
    AZURE_STORAGE_ACCOUNT_KEY=
    AZURE_STORAGE_ACCOUNT_NAME=
    AZURE_STORAGE_CONTAINER_NAME=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USER=
    SMTP_PASS=
    SMTP_PASS_APP=

## Uso

1.  Inicia el servidor de desarrollo:
    ```bash
    # Usando npm
    npm run dev


El servidor estará escuchando en el puerto especificado en tus variables de entorno (o un puerto por defecto, ej: 3000).
