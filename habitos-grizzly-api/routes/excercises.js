const express = require('express');
const router = express.Router();
const excercisesController = require('../controllers/excercisesController');

router.post('/listaEjercicios', excercisesController.getEjerciciosById);
router.post('/insertExcercise', excercisesController.saveExcercise);
router.post('/listaEjerciciosPorCategoria', excercisesController.getExcercisesByCategoria);
router.put('/updateExcercise/:id_ejercicio', excercisesController.updateExcercise);
router.delete('/deleteExcercise/:id_ejercicio', excercisesController.deleteExcercise);

module.exports = router;