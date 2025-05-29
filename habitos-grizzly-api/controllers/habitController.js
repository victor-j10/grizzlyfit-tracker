//variable que accede al método de la conexión a la bd.
const db = require('../db/connection');
const mailer = require('../utils/mailer');

//exportamos la función getHabits para obtener los datos del usuario.
exports.getHabits = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM habitos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener hábitos' });
  }
};

//exportamos la función getHabitsByID para obtener los hábitos del usuario en la sesión
exports.getHabitsById = async (req, res) => {
  //recibir el id que viene viajando desde el front-end
  const { id } = req.body;

  //try catch para manejo de excepciones y errores.
  try {
    //variable que guardará las filas de la consulta
    const [rows] = await db.promise().query('SELECT * FROM habitos WHERE id_usuario = ?', [id]);

    //si es igual a cero se retorna el siguiente mensaje
    if (rows.length === 0) {
      return res.json([]);
      //return res.status(404).json({ error: 'No hay habitos registrados' });
    }

    //se envía la lista de los hábitos.
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener hábitos' });
  }
};

//exportamos la función getHabitsByID para obtener los hábitos del usuario en la sesión
exports.getHabitsByCategoria = async (req, res) => {
  //recibir el id que viene viajando desde el front-end
  const { categoria, id } = req.body;

  if (!categoria) {
    const [rowss] = await db.promise().query('SELECT * FROM habitos WHERE id_usuario = ?', [id]);

    if (rowss.length === 0) {
      return res.json([]);
      //return res.status(404).json({ error: 'No hay habitos registrados' });
    }

    return res.json(rowss);
  }

  //try catch para manejo de excepciones y errores.
  try {
    //variable que guardará las filas de la consulta
    const [rows] = await db.promise().query('SELECT * FROM habitos WHERE categoria = ? AND id_usuario = ?', [categoria, id]);

    //si es igual a cero se retorna el siguiente mensaje
    if (rows.length === 0) {
      return res.json([]);
      //return res.status(404).json({ error: 'No hay habitos registrados' });
    }

    //se envía la lista de los hábitos.
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener hábitos' });
  }
};

exports.saveHabit = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, progreso, cumplido, categoria, id_usuario } = req.body;

  try {
    if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !categoria || !id_usuario) {
      return res.status(400).json({ error: "Campos vacíos" });
    }

    const fecha_inicio_formateada = new Date(fecha_inicio).toISOString().split("T")[0];
    const fecha_fin_formateada = new Date(fecha_fin).toISOString().split("T")[0];



    const [result] = await db.promise().query(
      'INSERT INTO habitos (nombre, descripcion, fecha_inicio, fecha_fin, progreso, cumplido, categoria, id_usuario) VALUES (?,?,?,?,?,?,?,?)',
      [nombre, descripcion, fecha_inicio_formateada, fecha_fin_formateada, progreso, cumplido, categoria, id_usuario]
    );


    return res.json({ message: "Hábito creado", id: result.insertId });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar el hábito' })
  }
}

exports.updateHabit = async (req, res) => {
  const habito = req.body;

  try {
    if (!habito.nombre || !habito.descripcion || !habito.fecha_inicio || !habito.fecha_fin || !habito.categoria) {
      return res.status(400).json({ error: "Campos vacíos" });
    }

    const fecha_inicio_formateada = new Date(habito.fecha_inicio).toISOString().split("T")[0];
    const fecha_fin_formateada = new Date(habito.fecha_fin).toISOString().split("T")[0];


    console.log(fecha_i, fecha_f);

    const [result] = await db.promise().query(
      'UPDATE habitos SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, progreso = ?, cumplido = ?, categoria = ?, id_usuario = ? WHERE id_habito = ?',
      [habito.nombre, habito.descripcion, fecha_inicio_formateada, fecha_fin_formateada, habito.progreso, habito.cumplido, habito.categoria, habito.id_usuario, habito.id_habito]
    );


    return res.json({ message: "Hábito actualizado", result });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar el hábito' })
  }
}

exports.deleteHabit = async (req, res) => {
  const { id_habito } = req.body;
  //console.log(id_habito);
  try {

    const [result] = await db.promise().query(
      'DELETE FROM habitos WHERE id_habito = ?',
      [id_habito]
    );


    return res.json({ message: "Hábito eliminado", result });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar el hábito' })
  }
}

exports.updateProgreso = async (req, res) => {
  const { newProgreso, idHabito, id } = req.body;

  try {

    const [rows] = await db.promise().query(
      'UPDATE habitos SET progreso = ? WHERE id_habito = ?',
      [newProgreso, idHabito]
    );

    const [rowss] = await db.promise().query('SELECT * FROM habitos WHERE id_usuario = ?', [id]);

    //console.log(rowss);
    return res.json({ message: "Progreso actualizado", response: rows, rows: rowss });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar el hábito' })
  }
}

//método para obtener los hábitos a vencer
const obtenerHabitosPorVencer = async () => {
  //se guarda la fecha actual del día
  const hoy = new Date().toISOString().split('T')[0];
  //se guarda la fecha siguiente
  const mañana = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // hoy + 1 día

  //se crea la consulta
  const [habitos] = await db.promise().query(`
    SELECT h.*, u.correo, u.nombre as nombre_usuario FROM habitos as h JOIN usuarios as u ON u.id_usuario = h.id_usuario WHERE h.fecha_fin BETWEEN ? AND ? AND h.cumplido = 0
  `, [hoy, mañana]);

  return habitos;
};


//método para enviar notificaciones pendientes
exports.enviarNotificacionesPendientes = async () => {
  //se obtienen los hábitos a vencer
  const habitos = await obtenerHabitosPorVencer();

  //se recorren los hábitos
  for (const habit of habitos) {
    //se guarda la fecha trasnformandola en formato yyyy-mm-dd
    const fechaLimite = new Date(habit.fecha_fin).toISOString().split('T')[0];
    //se guarda el mensaje a través del método "generarPlantillaCorreo" envíandole el nombre de usuario, 
    // el nombre del hábito y la fecha
    const mensaje = generarPlantillaCorreo(habit.nombre_usuario, habit.nombre, fechaLimite);
    //se llama al método enviarNotificación y se envían los datos
    await mailer.enviarNotificacion({
      correo: habit.correo, // asumimos que cada hábito tiene el correo
      asunto: `Tu hábito "${habit.nombre}" está por vencer`,
      mensaje
    });
  }

  console.log(`Notificaciones enviadas para ${habitos.length} hábitos.`);
};

//plantilla para el mensaje
const generarPlantillaCorreo = (nombre, habito, fecha) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #4f46e5;">🔔 Recordatorio de Hábito</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Este es un recordatorio para que cumplas tu hábito:</p>

        <div style="background-color: #f3f4f6; padding: 10px 15px; border-radius: 6px; margin-top: 10px; margin-bottom: 10px;">
          <p style="margin: 0;"><strong>📌 Hábito:</strong> ${habito}</p>
          <p style="margin: 0;"><strong>📅 Fecha límite:</strong> ${fecha}</p>
        </div>

        <p>No lo dejes para después 💪 ¡Tú puedes lograrlo!</p>

        <a href="http://localhost:5173/habitList" style="display:inline-block; padding:10px 15px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none; margin-top: 15px;">
          Ir a mi panel de hábitos
        </a>

        <p style="margin-top: 20px; font-size: 12px; color: #888;">Este correo fue generado automáticamente por tu app de hábitos.</p>
      </div>
    </div>
  `;
};

//envío manual

exports.enviarCorreoManual = async (req, res) => {
  const { correo } = req.body;
  //console.log(correo);

  try {
    await mailer.enviarNotificacion({
      correo: correo,
      asunto: 'Correo manual',
      mensaje: '<p>Esto es una prueba manual desde el API</p>'
    });
    res.status(200).json({ mensaje: 'Correo enviado' });
  } catch (error) {
    console.error('Error en API:', error.message);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
};
