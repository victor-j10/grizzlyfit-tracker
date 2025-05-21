const express = require('express');
const router = express.Router();
const rutinaCompletionsController = require('../controllers/rutinaCompletionsController');

router.get('/vecesCompletada', rutinaCompletionsController.getCompletionsCount);
router.put('/insertCompletions', rutinaCompletionsController.saveCompletionsCount);
router.post('/resetRutinas', rutinaCompletionsController.resetCompletions);
router.post('/daysRacha', rutinaCompletionsController.daysOfRacha);

module.exports = router;