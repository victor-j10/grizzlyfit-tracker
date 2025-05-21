const db = require('../db/connection');
const { getCompletionsCount, saveRutinaCompletions } = require('./rutinaCompletionsController');

exports.saveRutina = async (req, res) => {
    const { nombre, tipo_rutina, dia, descripcion, id_usuario } = req.body;

    try {
        //validamos que los campos no estén vacíos
        if (!nombre || !tipo_rutina || !dia || !descripcion) {
            return res.status(400).json({ message: "Campos vacíos" });
        }

        //validamos que la rutina no haya sido creada ya
        const [response] = await db.promise().query(
            'SELECT * FROM rutinas WHERE dia = ?',
            [dia]
        );
        if (response.length > 0) {
            return res.status(401).json({ message: "Ya existe una rutina para este día" })
        }
        //creamos un objeto para validar el numero de la semana
        const diasSemana = {
            Lunes: 1,
            Martes: 2,
            Miercoles: 3,
            Jueves: 4,
            Viernes: 5,
            Sabado: 6,
            Domingo: 7,
        };

        const diaNumero = diasSemana[dia]; // 2


        const [result] = await db.promise().query(
            'INSERT INTO rutinas (nombre, tipo_rutina, dia, num_dia, descripcion) VALUES (?,?,?,?,?)',
            [nombre, tipo_rutina, dia, diaNumero, descripcion]);

        const [result2] = await db.promise().query(
            'INSERT INTO usuarios_rutinas (usuario_id, rutina_id) VALUES (?,?)',
            [id_usuario, result.insertId]
        )

        const result_completions = await saveRutinaCompletions(result.insertId, id_usuario);


        return res.json({ message: "rutina creada", id_rutina: result.insertId, id_rutinas_usuarios: result2.insertId, message2: result_completions });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error al insertar al crear la rutina" });
    }

}

exports.saveEjerciciosToRutina = async (req, res) => {
    const { rutina_id, ejercicio_id, orden, duracion_segundos } = req.body;

    try {
        if (!rutina_id || !ejercicio_id || !orden || !duracion_segundos) {
            return res.status(400).json({ message: "Campos vacíos" });
        }

        const [response] = await db.promise().query(
            'SELECT * FROM rutinas_ejercicios WHERE rutina_id = ? AND ejercicio_id = ?',
            [rutina_id, ejercicio_id]
        );
        if (response.length > 0) {
            return res.status(401).json({ message: "Ya existe este ejercicio en la rutina" })
        }

        const [result] = await db.promise().query(
            'INSERT INTO rutinas_ejercicios (rutina_id, ejercicio_id, orden, duracion_segundos) VALUES (?,?,?,?)',
            [rutina_id, ejercicio_id, orden, duracion_segundos]);

        return res.json({ message: "Ejercicio insertado en la rutina", result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error al insertar el ejercicio en la rutina" })
    }
}

exports.getRutinasUser = async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const [rows] = await db.promise().query(
            'SELECT r.id_rutina, r.nombre as nombre_rutina, r.tipo_rutina, r.dia, r.descripcion, r_e.orden, e.nombre, e.id_ejercicio, e.sets, e.reps, r_e.id_rutinas_ejercicios ,r_e.duracion_segundos FROM usuarios_rutinas as u_r JOIN usuarios as u ON u.id_usuario = u_r.usuario_id JOIN rutinas as r ON r.id_rutina = u_r.rutina_id JOIN rutinas_ejercicios as r_e ON r_e.rutina_id = u_r.rutina_id JOIN ejercicios as e ON e.id_ejercicio = r_e.ejercicio_id WHERE u.id_usuario = ? ORDER BY r.num_dia, r_e.orden',
            [id_usuario]);

        //console.log(rows);

        //creamos un nuevo objeto tipo map
        const rutinasMap = new Map();

        //con el forEach recorremos un elemento del arreglo rows.
        rows.forEach((row) => {
            //creamos una constante llamada key con la que vamos a identificar cada rutina
            const key = row.id_rutina;

            //validamos que no exista una entrada en el map, si no existe, la creamos
            if (!rutinasMap.has(key)) {
                //seteamos en esa key (entrada) los datos correspondientes, incluyendo un array vacío que luego llenaremos
                rutinasMap.set(key, {
                    nombre: row.nombre_rutina,
                    tipo_rutina: row.tipo_rutina,
                    dia: row.dia,
                    descripcion: row.descripcion,
                    id_rutina: row.id_rutina,
                    ejercicios: [],
                });
            }

            //obtenemos el valor de la key en proceso y añadimos en su array de ejercicios las variables correspondientes
            rutinasMap.get(key).ejercicios.push({
                id_ejercicio: row.id_ejercicio,
                nombre: row.nombre,
                orden: row.orden,
                reps: row.reps,
                sets: row.sets,
                duracion_segundos: row.duracion_segundos,
                id_rutinas_ejercicios: row.id_rutinas_ejercicios,
            });
        });

        // Convertimos el objeto map a array para manipularlo desde el front
        const rutinasArray = Array.from(rutinasMap.values());

        const vecesCompletada = await getCompletionsCount(id_usuario);
        //console.log(vecesCompletada);

        //enviamos la respuesta al front
        res.json({ rutinasUser: rutinasArray, vecesCompletada: vecesCompletada });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error al insertar el ejercicio en la rutina" })
    }
}

exports.getRutinaByDia = async (req, res) => {
    const { id_usuario, dia } = req.body;

    try {
        const [rows] = await db.promise().query(
            'SELECT r.nombre, r.tipo_rutina, r.dia, r_e.orden, e.nombre, e.sets, e.reps, r_e.duracion_segundos FROM usuarios_rutinas as u_r JOIN usuarios as u ON u.id_usuario = u_r.usuario_id JOIN rutinas as r ON r.id_rutina = u_r.rutina_id JOIN rutinas_ejercicios as r_e ON r_e.rutina_id = u_r.rutina_id JOIN ejercicios as e ON e.id_ejercicio = r_e.ejercicio_id WHERE u.id_usuario = ? AND r.dia = ? ORDER BY r_e.orden',
            [id_usuario, dia]);

        res.json(rows);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error al insertar el ejercicio en la rutina" })
    }
}

exports.deleteRutina = async (req, res) => {
    const { id_rutina, id_usuario } = req.params;
    //console.log(id_rutina)
    //console.log(id_usuario)

    try {
        const [deleteUsuarioRutina] = await db.promise().query(
            'DELETE FROM usuarios_rutinas WHERE usuario_id = ? AND rutina_id = ?',
            [id_rutina, id_usuario]
        )

        const [deleteRutina] = await db.promise().query(
            'DELETE FROM rutinas WHERE id_rutina = ?',
            [id_rutina]
        )

        res.status(200).json({ message: 'Rutina eliminada con éxito' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error al eliminar la rutina" })
    }
}