import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext";
import { CreateExcercises } from "./CreateExcercises";
import { UpdateExcercises } from "./UpdateExcercises";
import { Home } from "../Home";
import axios from "axios";

export const ExcercisesList = () => {

    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosUnique, setEjerciciosUnique] = useState([]);
    const [filtro, setFiltro] = useState("Todos");
    const { usuario } = useAuth();
    const id = usuario.id_usuario;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
    const [ejercicioDelete, setEjercicioDelete] = useState(false);
    const [activeOption, setActiveOption] = useState('ejercicioList');

    const abrirModal = () => {
        setModalOpen(true)
    };

    const cerrarModal = () => {
        setModalOpen(false);
    }

    const abrirModalUpdate = () => {
        setModalOpenUpdate(true)
    };

    const cerrarModalUpdate = () => {
        setModalOpenUpdate(false);
    }

    const obtenerEjercicio = (ejercicio) => {
        abrirModalUpdate();
        setEjerciciosUnique(ejercicio);
    }

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchEjercicios = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ejercicios/listaEjercicios`, { id });
                setEjercicios(response.data);
            } catch (error) {
                if (error.response) {
                    // Error desde el servidor con status 4xx o 5xx
                    if (error.response.data.message) {
                        return alert(error.response.data.message);
                    }
                    alert(error.response.data.error);
                } else if (error.request) {
                    // La petición se hizo pero no hubo respuesta
                    console.error('No hubo respuesta del servidor');
                } else {
                    // Fallo al construir la petición
                    console.error('Error desconocido:', error.error);
                }
            }
        }

        fetchEjercicios();

    }, [id, modalOpen, modalOpenUpdate, ejercicioDelete]);

    const eliminar = async (id_ejercicio) => {
        setEjercicioDelete(true);
        if (confirm("¿Desea eliminar este ejercicio?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ejercicios/deleteExcercise/${id_ejercicio}`, {
                    data: { id_ejercicio }
                });
                const { message } = response.data;
                alert(message);
                setEjercicioDelete(false);

            } catch (error) {
                if (error.response) {
                    // Error desde el servidor con status 4xx o 5xx
                    if (error.response.data.message) {
                        return alert(error.response.data.message);
                    }
                    alert(error.response.data.error);
                } else if (error.request) {
                    // La petición se hizo pero no hubo respuesta
                    console.error('No hubo respuesta del servidor');
                } else {
                    // Fallo al construir la petición
                    console.error('Error desconocido:', error);
                }
            }
            

        }
    }

    const filtrarEjercicios = (ejercicio) => {
        if (filtro === 'todos') return true;
        if (filtro === 'pecho') return ejercicio.categoria === "Pecho";
        if (filtro === 'abdomen') return ejercicio.categoria === "Abdomen";
        if (filtro === 'cardio') return ejercicio.categoria === "Cardio";
        if (filtro === 'piernas') return ejercicio.categoria === "Piernas" || ""
        return true;
    };


    return (
        <div className="flex h-screen">

            <Home activeOption={activeOption} setActiveOption={setActiveOption} />
            {/*HEADER*/}

            <div className="w-4/5 max-w-6xl mx-auto p-6 overflow-y-auto">
                <main className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold mb-6">Resumen de Ejercicios</h1>

                        <button
                            onClick={abrirModal}
                            className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 hover:bg-lime-500 hover:text-white hover:outline-lime-600 cursor-pointer">
                            Nuevo Ejercicio
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Cumplidos */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
                                    <span className="material-icons">numbers</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total de ejercicios</p>
                                    <p className="text-xl font-bold">
                                        {ejercicios.length}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>


                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Mis Ejercicios</h2>

                        <select
                            className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="pecho">Pecho</option>
                            <option value="abdomen">Abdomen</option>
                            <option value="pierna">Piernas</option>
                            <option value="cardio">Cardio</option>
                        </select>
                    </div>
                    <div className="space-y-6">
                        {ejercicios.filter(filtrarEjercicios).map((ejercicio) => (
                            <div
                                key={ejercicio.id_ejercicio}
                                className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-lg"
                            >
                                {/* INFO IZQUIERDA */}
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold text-gray-800">{ejercicio.nombre}</h3>
                                    <p className="text-sm text-gray-500">📆 Frecuencia: Diario</p>
                                    <p className="text-sm text-gray-500">📕 Descripcion: {ejercicio.descripcion}</p>
                                    <p className="text-sm text-gray-500">🏷 Categoría: {ejercicio.categoria}</p>
                                    <p className="text-sm text-gray-500">🏋️‍♀️ Sets: {ejercicio.sets}</p>
                                    <p className="text-sm text-gray-500">⌚ Reps: {ejercicio.reps}</p>
                                </div>

                                {/* INFO DERECHA */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 w-full md:w-1/2">
                                    {/* Botones */}
                                    <div className="flex flex-col justify-center gap-1 items-center sm:flex-row">
                                        <button
                                            onClick={() => obtenerEjercicio(ejercicio)}
                                            className="px-4 py-2 w-full text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                        >
                                            Actualizar
                                        </button>
                                        <button
                                            onClick={() => eliminar(ejercicio.id_ejercicio)}
                                            className="px-4 py-2 w-full text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </main >

                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </div>
            {modalOpen && (
                <CreateExcercises cerrarModal={cerrarModal} />
            )}

            {modalOpenUpdate && (
                <UpdateExcercises cerrarModalUpdate={cerrarModalUpdate} ejerciciosUnique={ejerciciosUnique} setEjerciciosUnique={setEjerciciosUnique} />
            )}
        </div>

    )
}
