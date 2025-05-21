//se importa la librería
const jwt = require('jsonwebtoken');

//Se exporta una función llamada verifyToken, que recibe la petición (req), la respuesta (res) y la función next() (necesaria en middleware). 
exports.verifyToken = (req, res, next) => {
  //Obtiene el token del header authorization.
  const token = req.headers['authorization'];

  //Si no se encuentra un token, se responde con un error 403 (Prohibido).
  if (!token) return res.status(403).json({ error: "Token requerido" });

  try {
    //Se intenta verificar el token con jwt.verify()
    //Se usa la clave secreta que puede venir del .env (JWT_SECRET) o una por defecto ('secreto123').
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    //si es válido, se agrega el usuario decodificado al objeto req para usarlo en el controlador.
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};