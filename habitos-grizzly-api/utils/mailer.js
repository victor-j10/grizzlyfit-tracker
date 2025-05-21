// utils/mailer.js
//libreria para email
const nodemailer = require('nodemailer');
require('dotenv').config();

//se construye el servicio (transportador) que enviará el email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//se crea el método para enviar la notificación
//se recibe el correo destinatario, el asunto y el mensaje.
exports.enviarNotificacion = async ({ correo, asunto, mensaje }) => {
  try {
    //se envúa el email
    const info = await transporter.sendMail({
      from: `"GrizzlyFit Tracker" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: asunto,
      html: mensaje
    });

    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};
