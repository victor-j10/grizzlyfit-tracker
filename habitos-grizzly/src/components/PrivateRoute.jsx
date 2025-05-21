//imporytamos navigate para navegar entre rutas y useAuth para utilizar los contextos
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

//exportamos la función con su children
export function PrivateRoute({ children }) {
    //declaramos las constantes token y cargando para obtener sus valores
    const { token, cargando } = useAuth();

    //si cargando es verdad se retornará la siguiente vista
    if (cargando) {
        return <div className="text-center mt-10">Cargando...</div>; // o un spinner
    }
    //si es false, y existe un token, retornará el children. en dado caso, irá al login.
    return token ? children : <Navigate to="/login" />;
}
