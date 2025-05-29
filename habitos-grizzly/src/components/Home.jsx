import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export const Home = ({ activeOption, setActiveOption }) => {
    //declaro dos variables, usuario y logout, y las inicializo como useAuth para poder utilizar su contenido.
    //en el caso de usuario los datos almacenados en el localStorage.
    //en el caso de logout el método que se usa para limpiar la sesión y los datos del localStorage.
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const dashboard = () => {
        navigate("/dashboard");
    }

    const listaHabitos = () => {
        navigate("/habitList");
    }

    const listaEjercicios = () => {
        navigate("/ejercicioList")
    }

    const gestionRutinas = () => {
        navigate("/gestionRutina");
    }

    const editProfile = () => {
        navigate("/editProfile");
    }

    return (

        <aside className="w-1/5 bg-white border-r border-gray-200 shadow-sm">
            <div className="h-20 flex flex-col items-center justify-center border-b">
                <span className="text-xl font-bold tracking-wide">🌱 HabitPro</span>
            </div>
            <nav className="p-4 space-y-4">

                <a
                    onClick={() => {
                        dashboard();
                        setActiveOption('dashboard');
                    }}
                    className=
                    {`flex items-center space-x-2 text-sm font-medium  
                        ${activeOption === "dashboard" ? "text-lime-600" : "text-gray-700"}
                    hover:text-lime-600 
                    cursor-pointer`}
                >
                    <span className="material-icons">dashboard</span><span>Dashboard</span>
                </a>
                <a
                    onClick={() => {
                        listaHabitos();
                        setActiveOption('habitList');
                    }}
                    className=
                    {`flex items-center space-x-2 text-sm font-medium  
                        ${activeOption === "habitList" ? "text-lime-600" : "text-gray-700"}
                    hover:text-lime-600 
                    cursor-pointer`}
                >
                    <span className="material-icons">check_circle</span><span>Mis Hábitos</span>
                </a>
                <a
                    onClick={() => {
                        listaEjercicios();
                        setActiveOption('ejercicioList');
                    }}
                    className=
                    {`flex items-center space-x-2 text-sm font-medium  
                        ${activeOption === "ejercicioList" ? "text-lime-600" : "text-gray-700"}
                    hover:text-lime-600 
                    cursor-pointer`}>
                    <span className="material-icons">fitness_center</span><span>Mis Ejercicios</span>
                </a>
                <a
                    onClick={() => {
                        gestionRutinas();
                        setActiveOption('gestionRutina');
                    }}
                    className=
                    {`flex items-center space-x-2 text-sm font-medium  
                        ${activeOption === "gestionRutina" ? "text-lime-600" : "text-gray-700"}
                    hover:text-lime-600 
                    cursor-pointer`}>
                    <span className="material-icons">insert_chart</span><span>Mis Rutinas</span>
                </a>
                <a onClick={() => {
                    editProfile();
                    setActiveOption('editProfile');
                }}
                    className=
                    {`flex items-center space-x-2 text-sm font-medium  
                        ${activeOption === "editProfile" ? "text-lime-600" : "text-gray-700"}
                    hover:text-lime-600 
                    cursor-pointer`}
                >
                    <span className="material-icons">settings</span><span>Configuración</span>
                </a>
                <a onClick={logout} className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-lime-600 cursor-pointer">
                    <span className="material-icons">logout</span><span>Cerrar Sesión</span>
                </a>
            </nav>
        </aside>


    )
}
