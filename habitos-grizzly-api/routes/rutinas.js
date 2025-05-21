const express = require('express');
const router = express.Router();
const rutinaController = require('../controllers/rutinasController');

router.post('/', rutinaController.getRutinasUser);
router.post('/rutinaByDia', rutinaController.getRutinaByDia)
router.post('/rutinas', rutinaController.saveRutina);
router.post('/insertEjercicios', rutinaController.saveEjerciciosToRutina)
router.delete('/deleteRutina/:id_rutina/:id_usuario', rutinaController.deleteRutina);

module.exports = router;