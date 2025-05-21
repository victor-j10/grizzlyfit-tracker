const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const mailer = require('../utils/mailer')

router.get('/', habitController.getHabits);
router.post('/listaHabitos', habitController.getHabitsById);
router.post('/listaHabitosPorCategoria', habitController.getHabitsByCategoria);
router.post('/insertHabito', habitController.saveHabit);
router.put('/updateHabit/:id_habito', habitController.updateHabit);
router.put('/progresoUpdate', habitController.updateProgreso);
router.delete('/deleteHabit/:id_habito', habitController.deleteHabit);
router.get('/notificar-habitos', async (req, res) => {
  try {
    await habitController.enviarNotificacionesPendientes();
    res.status(200).json({ mensaje: 'Notificaciones enviadas con éxito' });
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
    res.status(500).json({ error: 'Error enviando notificaciones' });
  }
});

router.post('/enviar-correo', habitController.enviarCorreoManual);

module.exports = router;