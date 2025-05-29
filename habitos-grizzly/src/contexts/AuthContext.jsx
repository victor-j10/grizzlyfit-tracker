import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//creamos una variable para crear un contexto.
//al crear un contexto podemos luego usarlo con useContext, en este caso crearemos un contexto que permita
//usar lo que hagamos acá en las demás vistas
const AuthContext = createContext();

//exportamos la función diciendole que recibirá un children, en este caso, todo lo que está debajo de la etiqueta
//en App.jsx.
export function AuthProvider({ children }) {
    //declaramos la variables con useState para poderlas modificar. también con useNavigate() para usar sus metodos.
    const [usuario, setUsuario] = useState(null);
    const [habitosBDM, setHabitosBDM] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true); // 👈 Nuevo
    const navigate = useNavigate();

    //usamos un useEffect para ejecutar lo que está dentro cada vez que se llame a este componente
    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const storedToken = localStorage.getItem("token");
        //validamos que las variables tengan algo dentro, si lo tienen, seteamos al usuario con su info
        //y al token también.
        if (storedUser && storedToken) {
            setUsuario(JSON.parse(storedUser));
            setToken(storedToken);
        }
        //luego seteamos el cargando a false para indicarle a la página que ya ha terminado de cargar.
        setCargando(false); // 👈 Ya terminó de cargar
    }, []);

    //guarda los datos de la sesión, recibe el usuario y el token creado desde el login
    const login = (usuario, token) => {
        //setea las variables del useState
        setUsuario(usuario);
        setToken(token);
        //guarda los datos en el localStorage
        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("token", token);
    };

    //cierra los datos de la sesión.
    const logout = () => {
        //setea las variables del useState a null
        setUsuario(null);
        setToken(null);
        //remueve los datos guardoados en localStorage
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("habitos");
        //lo envía al login.
        navigate("/login");
    };

    const habitosBD = (habitos) => {
        setHabitosBDM(habitos);
        localStorage.setItem("habitos", JSON.stringify(habitos));

    }

    return (
        //enviamos al authprovider los valores que pueden consultar sus children, en este caso
        //todas las etiquetas declaradas debajo en el App.jsx
        <AuthContext.Provider value={{ usuario, token, login, logout, cargando, habitosBD, habitosBDM }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar el contexto
export function useAuth() {
    return useContext(AuthContext);
}
