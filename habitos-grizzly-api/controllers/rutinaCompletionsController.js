const db = require('../db/connection');
const moment = require('moment');

exports.getCompletionsCount = async (id_usuario) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM rutina_completions WHERE id_usuario = ?', [id_usuario]
    );
    return rows;
}

exports.saveCompletionsCount = async (req, res) => {
    const { id_rutina, id_usuario } = req.body;
    const ahora = new Date();
    const completado = 1;
    try {
        const [validateRutina] = await db.promise().query('SELECT completado FROM rutina_completions WHERE id_rutina = ? AND id_usuario = ? AND completado = 1',
            [id_rutina, id_usuario]);

        if (validateRutina.length > 0) {
            return res.json({ message: 'Esta rutina ya fue completada hoy' });
        }

        const [fetchRutina] = await db.promise().query('SELECT count FROM rutina_completions WHERE id_rutina = ? AND id_usuario = ?',
            [id_rutina, id_usuario]);

        const count = fetchRutina[0].count;
        const newCount = count + 1;

        const [saveCompletions] = await db.promise().query('UPDATE rutina_completions SET completado = ?, count = ?, fecha_modified = ? WHERE id_rutina = ? AND id_usuario = ?',
            [completado, newCount, ahora, id_rutina, id_usuario]);

        res.status(200).json({ message: 'Rutina completada!', saveCompletions });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al completar la rutina' })
    }
}

exports.resetCompletions = async (req, res) => {
    const { id_usuario } = req.body;
    const completado = 0;
    const fechaHoy = new Date().toISOString().split('T')[0];
    try {
        const [fetchRutinas] = await db.promise().query('SELECT * FROM rutina_completions WHERE fecha_modified < ? AND id_usuario = ? AND completado = 1', [fechaHoy, id_usuario]);

        if (fetchRutinas.length === 0) {
            return res.json({ message: 'Todas las rutinas están resets' })
        }
        const updates = [];
        for (let i = 0; i < fetchRutinas.length; i++) {
            const rutina = fetchRutinas[i];

            const [resetRutina] = await db.promise().query('UPDATE rutina_completions SET completado = ? WHERE id_rutina = ? AND id_usuario = ?',
                [completado, rutina.id_rutina, id_usuario]);

            updates.push(resetRutina.affectedRows);
        }
        res.status(200).json({ message: 'Rutinas resets', updates });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al resetear la rutina' });
    }
}

exports.saveRutinaCompletions = async (id_rutina, id_usuario) => {
    const actual = new Date();
    try {
        const [result3] = await db.promise().query(
            'INSERT INTO rutina_completions (id_rutina, id_usuario, fecha, completado, count, racha_actual, racha_max) VALUES (?,?,?,?,?,?,?)',
            [id_rutina, id_usuario, actual, 0, 0, 0, 0]
        );

        const message2 = "insertado";
        return message2;


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al resetear la rutina' });
    }
}


exports.daysOfRacha = async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const [fetchRutinas] = await db.promise().query('SELECT * FROM rutina_completions WHERE id_usuario = ?', [id_usuario]);

        //console.log(fetchRutinas);
        if (fetchRutinas.length === 0) {
            return res.json({ message: 'No existen rutinas' })
        }


        const hoy = new Date().toISOString().split('T')[0];

        const hayIncompletas = fetchRutinas.some(r => r.completado === 0);
        const hayCompletas = fetchRutinas.some(r => r.racha_completed === 0);
        const algunaModificadaAntesDeHoy = fetchRutinas.some(r => r.fecha_modified.toISOString().split('T')[0] < hoy);


        if (hayIncompletas) {
            if (algunaModificadaAntesDeHoy) {
                const [resetRacha] = await db.promise().query('UPDATE rutina_completions SET completado = ?, racha_actual = ?, racha_completed = ? WHERE id_usuario = ?', [0, 0, 0, id_usuario])
                return res.json({ message: 'No completaste tu rutina :c', resetRacha });
            }
            return res.json({ message: 'Las rutinas aún no han sido completadas' });
        }

        if (hayCompletas) {
            const racha_actual = fetchRutinas[0].racha_actual + 1;
            const racha_max = fetchRutinas[0].racha_max;
            if (racha_actual > racha_max) {
                const [updateRacha] = await db.promise().query('UPDATE rutina_completions SET racha_actual = ?, racha_max = ?, racha_completed = ? WHERE id_usuario = ?', [racha_actual, racha_actual, 1, id_usuario])
                return res.status(200).json({ message: 'Prueba fin', updateRacha });
            }
            const [updateRacha] = await db.promise().query('UPDATE rutina_completions SET racha_actual = ?, racha_completed = ? WHERE id_usuario = ?', [racha_actual, 1, id_usuario])
            res.status(200).json({ message: 'Prueba fin', updateRacha });
        }

        res.status(200).json({ message: 'Ya completaste por hoy' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al resetear la rutina' });
    }
}

exports.daysOfRachaDaily = async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const date = new Date();
        const day = date.getDay();
        //console.log(day);

        const weekdays = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];

        const [fetchRutinas] = await db.promise().query('SELECT rC.*, r.dia FROM rutina_completions as rC JOIN rutinas as r ON r.id_rutina = rC.id_rutina WHERE rC.id_usuario = ?', [id_usuario]);

        //console.log(fetchRutinas);
        if (fetchRutinas.length === 0) {
            return res.json({ message: 'No existen rutinas' })
        }

        const rutinaActual = fetchRutinas.filter((rut) => rut.dia.toLowerCase() === weekdays[day]);
        const id_rutina = rutinaActual[0].id_rutina

        const [fetchRutinasActual] = await db.promise().query('SELECT * FROM rutina_completions WHERE id_usuario = ? AND id_rutina = ?', [id_usuario, id_rutina]);

        const hoy = new Date().toISOString().split('T')[0];

        //si está en cero --> no se ha completado la rutina
        const hayIncompletas = fetchRutinasActual.some(r => r.completado === 0);
        //si está en 1 --> se completó la rutina
        const hayCompletas = fetchRutinasActual.some(r => r.racha_completed === 0);
        //si es menor a la fecha actual, entonces ya pasó el día
        const algunaModificadaAntesDeHoy = fetchRutinasActual.some(r => r.fecha_modified.toISOString().split('T')[0] < hoy);


        //si hay una rutina en cero entra aquí
        if (hayIncompletas) {
            //si está en fechas pasadas se reinicia la racha
            if (algunaModificadaAntesDeHoy) {
                const [dateRecent] = await db.promise().query('SELECT * FROM rutina_completions WHERE id_usuario = 1 ORDER BY fecha_modified desc limit 1');
                const rutina = dateRecent[0];
                const diaMostReciente = rutina.fecha_modified
                console.log(diaMostReciente);
                console.log(hoy);
                const diferenciaEnDias = moment(hoy).diff(moment(diaMostReciente), 'days');
                console.log(diferenciaEnDias)
                if (diferenciaEnDias >= 2) {
                    const [resetRacha] = await db.promise().query('UPDATE rutina_completions SET completado = ?, racha_actual = ?, racha_completed = ? WHERE id_usuario = ?', [0, 0, 0, id_usuario])
                    return res.json({ message: 'Perdiste tu racha :c', resetRacha });
                }
                const [resetRacha] = await db.promise().query('UPDATE rutina_completions SET completado = ?, racha_completed = ? WHERE id_usuario = ?', [0, 0, 0, id_usuario])
                return res.json({ message: 'aún no completas la rutina :c', resetRacha });
            }
            //sino pasa a decir que la rutina aún no se cumple
            return res.json({ message: 'Las rutinas aún no han sido completadas' });
        }

        //

        if (hayCompletas) {
            const racha_actual = fetchRutinasActual[0].racha_actual + 1;
            const racha_max = fetchRutinasActual[0].racha_max;
            if (racha_actual > racha_max) {
                const [updateRacha] = await db.promise().query('UPDATE rutina_completions SET racha_actual = ?, racha_max = ?, racha_completed = ? WHERE id_usuario = ?', [racha_actual, racha_actual, 1, id_usuario])
                return res.status(200).json({ message: 'Prueba fin', updateRacha });
            }
            const [updateRacha] = await db.promise().query('UPDATE rutina_completions SET racha_actual = ?, racha_completed = ? WHERE id_usuario = ? AND id_rutina = ?', [racha_actual, 1, id_usuario, id_rutina])
            res.status(200).json({ message: 'Prueba fin', updateRacha });
        }

        res.status(200).json({ message: 'Ya completaste por hoy' });



    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error al resetear la rutina' });
    }
}
