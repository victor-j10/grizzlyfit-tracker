const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const habitsRoutes = require('./routes/habits');
const usersRoutes = require('./routes/user');
const excercisesRoutes = require('./routes/excercises');
const rutinasRoutes = require('./routes/rutinas');
const rutinaCompletions = require('./routes/rutinaCompletions');
const cron = require('node-cron');
const habitController = require('./controllers/habitController');

app.use(cors());
app.use(express.json());
//usuario
app.use('/api/user', usersRoutes);
app.use('/api/userById', usersRoutes);
app.use('/api/updateUsuario', usersRoutes);
//hábitos
app.use('/api/habits', habitsRoutes);
app.use('/api/habitsById', habitsRoutes);
app.use('/api/habitsByCategoria', habitsRoutes);
app.use('/api/habitInsert', habitsRoutes);
app.use('/api/habitUpdate', habitsRoutes);
app.use('/api/updateProgreso', habitsRoutes);
app.use('/api/habitDelete', habitsRoutes);
//ejercicios
app.use('/api/ejerciciosById', excercisesRoutes);
app.use('/api/excerciseInsert', excercisesRoutes);
app.use('/api/excerciseUpdate', excercisesRoutes);
app.use('/api/excerciseDelete', excercisesRoutes);
app.use('/api/ejerciciosByCategoria', excercisesRoutes);
//rutinas
app.use('/api/rutinas', rutinasRoutes);
//rutinas completions
app.use('/api/rutinaCompletions', rutinaCompletions);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//con cron podemos programar el envío. en este caso lo programo todos los días a las 2:30 pm
cron.schedule('30 14 * * *', async () => {
  //se manda un console.log para avisar que se está ejecutando la notificación
  console.log("⏰ Ejecutando notificación diaria de hábitos por vencer...");
  //se llama al método enviarNotificacionesPendientes
  await habitController.enviarNotificacionesPendientes(); // asumimos que ahí se manda la notificación
});
