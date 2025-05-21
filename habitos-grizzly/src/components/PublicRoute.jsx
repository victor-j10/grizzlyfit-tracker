//importamos el navigate y el useAuth.
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PublicRoute({ children }) {
  //creamos las constantes token y cargando para acceder a sus valores en el useAuth.
  const { token, cargando } = useAuth();

  //si existe un valor "true", mostramos la siguiente vista
  if (cargando) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  //sino, y existe un token, lo mandamos al home, en dado caso, lo seguimos dejando en el children.
  return token ? <Navigate to="/habitList" /> : children;
}