import nodemailer from "nodemailer";
import 'dotenv/config'

// Crear el transporte de correo con la configuración SMTP desde el archivo .env
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS_APP,
    },
});

// Función para enviar correos
const sendEmail = async (to, subject, text) => {
    try {

        let mailOptions = {
            from: `"API Servicio" <${process.env.SMTP_USER}>`, // El correo del remitente
            to, // Destinatario(s)
            subject, // Asunto del correo
            text, // Texto plano
        };

        // Enviar el correo
        let info = await transporter.sendMail(mailOptions);
        //console.log('Correo enviado: %s', to);
        return info;
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
        throw new Error('Error al enviar el correo');
    }
};

export {
    sendEmail,
};
