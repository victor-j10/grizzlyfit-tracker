import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Home = ({ activeOption, setActiveOption }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavigate = (route, option) => {
        navigate(route);
        setActiveOption(option);
        setMenuOpen(false); // Cierra el menú en móviles
    };

    return (
        <>
            {/* Botón hamburguesa (solo visible en móviles) */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-4 text-lime-600 focus:outline-none fixed top-0 left-0 z-50"
            >
                <span className="material-icons text-3xl">menu</span>
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm
                transform transition-transform duration-300 z-40
                ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:w-1/5
            `}>
                <div className="h-20 flex flex-col items-center justify-center border-b">
                    <span className="text-xl font-bold tracking-wide">🌱 HabitPro</span>
                </div>
                <nav className="p-4 space-y-4">
                    <a onClick={() => handleNavigate("/dashboard", "dashboard")}
                        className={`flex items-center space-x-2 text-sm font-medium cursor-pointer 
                        ${activeOption === "dashboard" ? "text-lime-600" : "text-gray-700"} hover:text-lime-600`}>
                        <span className="material-icons">dashboard</span><span>Dashboard</span>
                    </a>
                    <a onClick={() => handleNavigate("/habitList", "habitList")}
                        className={`flex items-center space-x-2 text-sm font-medium cursor-pointer 
                        ${activeOption === "habitList" ? "text-lime-600" : "text-gray-700"} hover:text-lime-600`}>
                        <span className="material-icons">check_circle</span><span>Mis Hábitos</span>
                    </a>
                    <a onClick={() => handleNavigate("/ejercicioList", "ejercicioList")}
                        className={`flex items-center space-x-2 text-sm font-medium cursor-pointer 
                        ${activeOption === "ejercicioList" ? "text-lime-600" : "text-gray-700"} hover:text-lime-600`}>
                        <span className="material-icons">fitness_center</span><span>Mis Ejercicios</span>
                    </a>
                    <a onClick={() => handleNavigate("/gestionRutina", "gestionRutina")}
                        className={`flex items-center space-x-2 text-sm font-medium cursor-pointer 
                        ${activeOption === "gestionRutina" ? "text-lime-600" : "text-gray-700"} hover:text-lime-600`}>
                        <span className="material-icons">insert_chart</span><span>Mis Rutinas</span>
                    </a>
                    <a onClick={() => handleNavigate("/editProfile", "editProfile")}
                        className={`flex items-center space-x-2 text-sm font-medium cursor-pointer 
                        ${activeOption === "editProfile" ? "text-lime-600" : "text-gray-700"} hover:text-lime-600`}>
                        <span className="material-icons">settings</span><span>Configuración</span>
                    </a>
                    <a onClick={logout}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-lime-600 cursor-pointer">
                        <span className="material-icons">logout</span><span>Cerrar Sesión</span>
                    </a>
                </nav>
            </aside>

            {/* Fondo oscuro al abrir el menú en móvil */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
};
