import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useRef } from "react";
import { Home } from "./Home";
import { UpdateHabits } from "./habits/UpdateHabits";
import { CreateHabits } from "./habits/CreateHabits";
import axios from "axios";


export const HabitList = () => {
    const [habits, setHabits] = useState([]);
    const { usuario } = useAuth();
    const { habitosBD } = useAuth();
    const id = usuario.id_usuario;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
    const [deleteHabito, setDeleteHabito] = useState(false);
    //const [filtroCategoria, setFiltroCategoria] = useState(false);
    const [habitUnique, setHabitUnique] = useState(null);
    const [filtro, setFiltro] = useState("Todos");
    const efectoEjecutado = useRef(false);
    const [activeOption, setActiveOption] = useState('habitList');
    //const [cargandoHabitos, setCargandoHabitos] = useState(true);
    const fechaActual = new Date().toISOString().split('T')[0];

    const abrirModal = () => setModalOpen(true);
    const abrirModalUpdate = () => setModalOpenUpdate(true);
    const cerrarModal = () => setModalOpen(false);
    const cerrarModalUpdate = async () => {
        await actualizarProgresoEnBd(habits);
        setModalOpenUpdate(false)
    }

    const actualizarProgresoEnBd = async (data) => {


        for (let habit of data) {
            const idHabito = habit.id_habito;
            const fecha_inicioL = habit.fecha_inicio.split('T')[0];
            const fecha_finL = habit.fecha_fin.split('T')[0];
            const cumplido = habit.cumplido;
            const newProgreso = calcularProgreso(fecha_inicioL, fecha_finL, cumplido);

            try {
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/habits/progresoUpdate`, { newProgreso, idHabito, id });
                const { message } = response.data;
                

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
        // Vuelve a traer los hábitos actualizados desde la BD
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits/listaHabitos`, { id });
            setHabits(response.data);
            habitosBD(response.data);
        } catch (error) {
            alert("Error al refrescar hábitos");
        }
    }


    useEffect(() => {
        if (!id) return;

        /*if (efectoEjecutado.current) return; // evita segunda ejecución en modo dev
        efectoEjecutado.current = true;*/

        const fetchHabits = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits/listaHabitos`, { id });
                
                setHabits(response.data);
                actualizarProgresoEnBd(response.data);
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

        fetchHabits();


    }, [id, modalOpen, modalOpenUpdate, deleteHabito]); //Se vuelve a ejecutar tras agregar o actualizar

    const calcularProgreso = (fecha_inicioL, fecha_finL, cumplido) => {
        if (cumplido === 1) {
            return 100;
        }
        const hoy = new Date();
        const fechaFormateada = hoy.toISOString().split('T')[0]; // "225-004-23"

        //convertir a DATE
        const fechaInicioNew = new Date(fecha_inicioL);
        const fechaFinNew = new Date(fecha_finL);
        const fechaHoyNew = new Date(fechaFormateada);


        if (fechaFormateada < fecha_inicioL) {
            return 0;
        } else if (fechaFormateada > fecha_finL) {
            return 100;
        }

        const diasTotales = Math.floor((fechaFinNew - fechaInicioNew) / (1000 * 60 * 60 * 24));
        const diasTranscurridos = Math.floor(fechaHoyNew - fechaInicioNew) / (1000 * 60 * 60 * 24);

        const progresoL = Math.round((diasTranscurridos * 100) / diasTotales, 2);
        return progresoL;
    }


    const filtrarHabitos = (habit) => {
        if (filtro === 'todos') return true;
        if (filtro === 'estudios') return habit.categoria === "Estudios";
        if (filtro === 'trabajo') return habit.categoria === "Trabajo";
        if (filtro === 'creativo') return habit.categoria === "Creativo"
        return true;
    };

    const obtenerHabito = async (habito) => {
        setHabitUnique(habito);
        abrirModalUpdate();
    }

    const eliminar = async (id_habito) => {
        setDeleteHabito(true);
        if (confirm("¿Desea eliminar este hábito?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits/deleteHabit/${id_habito}`, {
                    data: { id_habito } // 👈 el body va dentro de "data"
                });
                
                setDeleteHabito(false);
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

    }

    return (
        <>
            <div className="flex h-screen">

                <Home activeOption={activeOption} setActiveOption={setActiveOption} />

                <div className="w-4/5 max-w-6xl mx-auto p-6 overflow-y-auto">
                    <main className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold mb-6">Resumen de Hábitos</h1>

                            <button
                                onClick={abrirModal}
                                className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 hover:bg-lime-500 hover:text-white hover:outline-lime-600 cursor-pointer">
                                Nuevo Hábito
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {/* Cumplidos */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                        <span className="material-icons">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Cumplidos</p>
                                        <p className="text-xl font-bold">
                                            {habits.filter((habit) => habit.cumplido === 1).length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pendientes */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                                        <span className="material-icons">hourglass_empty</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pendientes</p>
                                        <p className="text-xl font-bold">
                                            {
                                                habits.filter((habit) => {
                                                    const fechaFin = habit.fecha_fin.split('T')[0];
                                                    return fechaFin > fechaActual && habit.cumplido === 0;
                                                }).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Por vencer */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-100 text-red-600 p-3 rounded-full">
                                        <span className="material-icons">warning</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Por Vencer</p>
                                        <p className="text-xl font-bold">
                                            {
                                                habits.filter((habit) => {
                                                    const fechaFin = habit.fecha_fin.split('T')[0];
                                                    return fechaFin === fechaActual && habit.cumplido === 0;
                                                }).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Vencidas */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
                                        <span className="material-icons">event_busy</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Vencidas</p>
                                        <p className="text-xl font-bold">
                                            {
                                                habits.filter((habit) => {
                                                    const fechaFin = habit.fecha_fin.split('T')[0];
                                                    return fechaFin < fechaActual && habit.cumplido === 0;
                                                }).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Mis Hábitos</h2>

                            <select
                                className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="estudios">Estudios</option>
                                <option value="creativo">Creativo</option>
                                <option value="trabajo">Trabajo</option>
                            </select>
                        </div>
                        <div className="space-y-6">
                            {habits.filter(filtrarHabitos).map((habit) => (
                                <div
                                    key={habit.id_habito}
                                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-lg"
                                >
                                    {/* INFO IZQUIERDA */}
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold text-gray-800">{habit.nombre}</h3>
                                        <p className="text-sm text-gray-500">📆 Frecuencia: Diario</p>
                                        <p className="text-sm text-gray-500">⏱ Fecha Límite: {habit.fecha_fin.split('T')[0]}</p>
                                        <p className="text-sm text-gray-500">🏷 Categoría: {habit.categoria}</p>
                                        <p className="text-sm text-gray-500">📊 Progreso: {habit.progreso}%</p>
                                    </div>

                                    {/* INFO DERECHA */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 w-full md:w-1/2">
                                        {/* Estado */}
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium 
                                        ${habit.cumplido === 1
                                                    ? "bg-green-100 text-green-700"
                                                    : habit.fecha_fin.split('T')[0] === fechaActual
                                                        ? "bg-red-100 text-red-600"
                                                        : habit.fecha_fin.split('T')[0] < fechaActual
                                                            ? "bg-gray-100 text-gray-600"
                                                            : "bg-yellow-100 text-yellow-700"}`}
                                        >
                                            {habit.cumplido === 1
                                                ? "✅ Cumplido"
                                                : habit.fecha_fin.split('T')[0] === fechaActual
                                                    ? "⚠️ Por Vencer"
                                                    : habit.fecha_fin.split('T')[0] < fechaActual
                                                        ? "Vencida"
                                                        : "⏳ Pendiente"}
                                        </span>

                                        {/* Botones */}
                                        <div className="flex flex-col justify-center gap-1 items-center sm:flex-row">
                                            <button
                                                onClick={() => obtenerHabito(habit)}
                                                className="px-4 py-2 w-full text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                            >
                                                Actualizar
                                            </button>
                                            <button
                                                onClick={() => eliminar(habit.id_habito)}
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
                </div>
            </div >

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>

            {/* Modal para el formulario */}
            {
                modalOpen && (
                    <CreateHabits cerrarModal={cerrarModal} />
                )
            }

            {/* Modal para el formulario actualizar*/}
            {
                modalOpenUpdate && (<UpdateHabits cerrarModalUpdate={cerrarModalUpdate} habitUnique={habitUnique} setHabitUnique={setHabitUnique} />)
            }
        </>
    );
}
