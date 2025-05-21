// testCorreo.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarCorreo() {
  try {
    const info = await transporter.sendMail({
      from: `"Test App" <${process.env.EMAIL_USER}>`,
      to: 'victorgampley6@gmail.com',
      subject: 'Correo de prueba',
      html: '<p>Este es un correo de prueba enviado desde Node.js</p>'
    });

    console.log('Correo enviado:', info.response);
  } catch (err) {
    console.error('Error al enviar:', err);
  }
}

enviarCorreo();
