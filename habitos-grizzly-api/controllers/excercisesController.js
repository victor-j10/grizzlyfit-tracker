const db = require('../db/connection');

//exportamos la función getHabitsByID para obtener los hábitos del usuario en la sesión
exports.getEjerciciosById = async (req, res) => {
  //recibir el id que viene viajando desde el front-end
  const { id } = req.body;

  //try catch para manejo de excepciones y errores.
  try {
    //variable que guardará las filas de la consulta
    const [rows] = await db.query('SELECT * FROM ejercicios WHERE id_usuario = ?', [id]);

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

exports.saveExcercise = async (req, res) => {
  const { nombre, descripcion, categoria, sets, reps, id_usuario } = req.body;

  try {
    if (!nombre || !descripcion || !categoria || sets === 0 || reps === 0) {
      return res.status(400).json({ message: "Campos vacíos" });
    }

    const [result] = await db.query(
      'INSERT INTO ejercicios (nombre, descripcion, categoria, sets, reps, id_usuario) VALUES (?,?,?,?,?,?)',
      [nombre, descripcion, categoria, sets, reps, id_usuario]);

    return res.json({ message: "ejercicio registrado", id: result.insertId });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al insertar el ejercicio" });
  }

}

exports.updateExcercise = async (req, res) => {
  const ejercicio = req.body;

  try {
    if (!ejercicio.nombre || !ejercicio.descripcion || !ejercicio.categoria || ejercicio.sets === 0 || ejercicio.reps === 0) {
      return res.status(400).json({ error: "Campos vacíos" });
    }

    const [result] = await db.query(
      'UPDATE ejercicios SET nombre = ?, descripcion = ?, categoria = ?, sets = ?, reps = ? WHERE id_ejercicio = ?',
      [ejercicio.nombre, ejercicio.descripcion, ejercicio.categoria, ejercicio.sets, ejercicio.reps, ejercicio.id_ejercicio]
    );


    return res.json({ message: "Ejercicio actualizado", result });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al actualizar el ejercicio' })
  }
}

exports.deleteExcercise = async (req, res) => {
  const { id_ejercicio } = req.body;

  try {

    if (!id_ejercicio) {
      return;
    }

    const [result] = await db.query('DELETE FROM ejercicios WHERE id_ejercicio = ?', [id_ejercicio]);
    return res.json({ message: "Ejercicio eliminado", result });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al eliminar" });
  }
}

exports.getExcercisesByCategoria = async (req, res) => {
  //recibir el id que viene viajando desde el front-end
  const { categoria, id } = req.body;

  if (!categoria) {
    const [rowss] = await db.query('SELECT * FROM ejercicios WHERE id_usuario = ?', [id]);

    if (rowss.length === 0) {
      return res.json([]);
      //return res.status(404).json({ error: 'No hay habitos registrados' });
    }

    return res.json(rowss);
  }

  //try catch para manejo de excepciones y errores.
  try {
    //variable que guardará las filas de la consulta
    const [rows] = await db.query('SELECT * FROM ejercicios WHERE categoria = ? AND id_usuario = ?', [categoria, id]);

    //si es igual a cero se retorna el siguiente mensaje
    if (rows.length === 0) {
      return res.json([]);
      //return res.status(404).json({ error: 'No hay habitos registrados' });
    }

    //se envía la lista de los hábitos.
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
};