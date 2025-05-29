const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const mailer = require('../utils/mailer');

exports.getUser = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

exports.getUsuarioPorCorreo = async (req, res) => {
  //recibo los datos que vienen viajando por el parámetro
  const { correo, password } = req.body;

  //try catch para manejar excepciones y errores.
  try {
    //válidación de campos vacíos
    if (!correo || !password) {
      return res.status(401).json({ error: "campos vacíos" });
    }

    //se realiza la consulta en la bd.
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    //se valida que hayan resultados
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    //se guarda al único usuario de la consulta
    const usuario = rows[0];

    //se valida la contraseña que viajó en los parametros con la registrada en la bd.
    const match = await bcrypt.compare(password, usuario.contraseña);

    //si match es false se envía un mensaje de contraseña incorrecta
    if (!match) {
      return res.status(401).json({ error: "contraseña incorrecta" });
    }

    //se crea el token para controlar la sesión del usuario en el front-end
    //Se crea un token JWT válido por 2 horas que contiene datos básicos del usuario.
    const token = jwt.sign({
      id: usuario.id, correo: usuario.correo, nombre: usuario.nombre
    }, process.env.JWT_SECRET || 'secreto123', { expiresIn: '2h' });

    //se envía un mensaje, los datos del usuario y el token.
    res.status(200).json({ mensaje: "Bienvenido", usuario, token }); // Solo el primer resultado
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};


exports.getUsuarioPorId = async (req, res) => {
  //recibo los datos que vienen viajando por el parámetro
  const { id } = req.body;

  //try catch para manejar excepciones y errores.
  try {


    //se realiza la consulta en la bd.
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);

    //se valida que hayan resultados
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    //se guarda al único usuario de la consulta
    const usuario = rows[0];

    //se envía un mensaje, los datos del usuario y el token.
    res.status(200).json({ mensaje: "Bienvenido", usuario }); // Solo el primer resultado
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.saveUser = async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    if (!nombre || !correo || !password) {
      return res.status(401).json({ error: 'Los campos no pueden estar vacíos' });
    }

    const [validateEmail] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (validateEmail.length !== 0) {
      return res.status(404).json({ error: 'Este correo ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [saveUsuario] = await db.promise().query('INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?,?,?)'
      , [nombre, correo, hashedPassword]);
    //se crea el token para controlar la sesión del usuario en el front-end
    //Se crea un token JWT válido por 2 horas que contiene datos básicos del usuario.
    const token = jwt.sign({
      id: saveUsuario.insertId, correo: correo, nombre: nombre
    }, process.env.JWT_SECRET || 'secreto123', { expiresIn: '2h' });

    //const link = "http://localhost:5173/login";

    //const mensaje = generarPlantillaWelcome(nombre, link);

    /*await mailer.enviarNotificacion({
      correo: correo, // asumimos que cada hábito tiene el correo
      asunto: `Bienvenido a GrizzlyFit Tracker`,
      mensaje
    });*/

    //se envía un mensaje, los datos del usuario y el token.
    res.status(200).json({
      message: "Bienvenido",
      usuario: { id_usuario: saveUsuario.insertId, correo: correo, nombre: nombre }, token
    }); // Solo el primer resultado


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

const generarPlantillaWelcome = (nombre, link) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h1 style="color: #4f46e5; margin-bottom: 10px;">🎉 ¡Bienvenido a la comunidad!</h1>
        <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Nos alegra tenerte a bordo. Gracias por registrarte en <strong>tu app de hábitos</strong>. Estás a punto de comenzar un camino para mejorar tu vida, un paso a la vez.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Para empezar, solo inicia sesión y configura tus primeros hábitos.
        </p>
        <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #4f46e5; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Empezar ahora
        </a>
        <p style="font-size: 14px; color: #555; line-height: 1.4;">
          ¿Tienes preguntas? Estamos aquí para ayudarte.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          Este correo fue generado automáticamente por tu app de hábitos. Por favor, no respondas este mensaje.
        </p>
      </div>
    </div>
  `;
};


exports.updateUsuario = async (req, res) => {
  const { nombre, correo, id_usuario } = req.body;

  try {
    if (!nombre || !correo) {
      return res.status(400).json({ error: "Campos vacíos" });
    }

    const [result] = await db.promise().query(
      'UPDATE usuarios SET nombre = ?, correo = ? WHERE id_usuario = ?',
      [nombre, correo, id_usuario]
    );

    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);


    return res.json({ message: "Usuario actualizado", result, rows });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al actualizar el usuario' })
  }
}

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, newPasswordAgain, id } = req.body;

  try {

    if (!oldPassword || !newPassword || !newPasswordAgain) {
      return res.status(401).json({ error: 'Los campos no pueden estar vacíos' })
    }

    const [verifyPassword] = await db.promise().query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    const usuario = verifyPassword[0];

    //se valida la contraseña que viajó en los parametros con la registrada en la bd.
    const match = await bcrypt.compare(oldPassword, usuario.contraseña);

    //si match es false se envía un mensaje de contraseña incorrecta
    if (!match) {
      return res.status(401).json({ error: "La contraseña actual ingresada es incorrecta" });
    }

    if (newPassword !== newPasswordAgain) {
      return res.status(401).json({ error: "La contraseña nueva no coincide" });
    }

    if (oldPassword === newPassword) {
      return res.status(401).json({ error: "La nueva contraseña no puede ser igual a la anterior" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updatePassword] = await db.promise().query('UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?', [hashedPassword, id]);
    res.status(200).json({ message: 'Contraseña actualizada', updatePassword });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(401).json({ error: 'El campo no puede estar vacío' })
    }

    const [validateEmail] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    if (validateEmail.length === 0) {
      return res.status(404).json({ error: 'Este correo no está registrado' });
    }

    const usuario = validateEmail[0];

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const link = `http://localhost:5173/recoverPassword?token=${token}`;

    const mensaje = generarPlantillaCorreo(usuario.nombre, link);

    await mailer.enviarNotificacion({
      correo: usuario.correo, // asumimos que cada hábito tiene el correo
      asunto: `Recupera tu contraseña`,
      mensaje
    });

    res.status(200).json({ message: 'Si existe un email, hemos enviado un enlace para que recuperes tu contraseña' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al enviar el email' })
  }
}


const generarPlantillaCorreo = (nombre, link) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h1 style="color: #4f46e5; margin-bottom: 10px;">🔒 Restablece tu contraseña</h1>
        <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:
        </p>
        <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #4f46e5; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Restablecer contraseña
        </a>
        <p style="font-size: 14px; color: #555; line-height: 1.4;">
          Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña seguirá segura.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          Este correo fue generado automáticamente por tu app de hábitos. Por favor, no respondas este mensaje.
        </p>
      </div>
    </div>
  `;
};

exports.updateNewPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updatePasswordDb] = await db.promise().query('UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?', [hashedPassword, userId]);
    //console.log(updatePasswordDb);

    const [userInfo] = await db.promise().query('SELECT nombre, correo FROM usuarios WHERE id_usuario = ?', [userId]);
    const usuario = userInfo[0];

    const loginLink = "http://localhost:5173/login";

    const mensaje = generarPlantillaPasswordUpdate(usuario.nombre, loginLink);

    await mailer.enviarNotificacion({
      correo: usuario.correo, // asumimos que cada hábito tiene el correo
      asunto: `Contraseña actualizada`,
      mensaje
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
}

const generarPlantillaPasswordUpdate = (nombre, loginLink) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h1 style="color: #4f46e5; margin-bottom: 10px;">✅ Contraseña actualizada</h1>
        <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Si no realizaste este cambio, te recomendamos cambiar tu contraseña nuevamente y revisar la seguridad de tu cuenta.
        </p>
        <a href="${loginLink}" style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #4f46e5; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Iniciar sesión
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          Este correo fue generado automáticamente por tu app de hábitos. Por favor, no respondas este mensaje.
        </p>
      </div>
    </div>
  `;
};