const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/usuarios', userController.getUsuarioPorCorreo);
router.post('/usuarioPorId', userController.getUsuarioPorId);
router.post('/registerUser', userController.saveUser);
router.put('/usuarioUpdate', userController.updateUsuario);
router.put('/changePassword', userController.changePassword);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.updateNewPassword);

module.exports = router;