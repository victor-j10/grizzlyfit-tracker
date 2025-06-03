import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { CreateRutina } from "./CreateRutina";
import { Home } from "../Home";
import axios from "axios";
import { UpdateRutina } from "./UpdateRutina";

export const RutinaList = () => {
    const { usuario } = useAuth();
    const [rutinas, setRutinas] = useState([]);
    const id_usuario = usuario.id_usuario;
    const [deleteRutina, setDeleteRutina] = useState(false);
    const [countRutina, setCountRutina] = useState(false);
    const [vecesCompletada, setVecesCompletada] = useState([]);
    const [rutinasTemp, setRutinasTemp] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [activeOption, setActiveOption] = useState('gestionRutina');

    const abrirModal = () => {
        setModalOpen(true)
    };

    const cerrarModal = () => {
        setModalOpen(false);
    }

    const abrirModalUpdate = () => {
        setModalUpdate(true)
    };

    const cerrarModalUpdate = () => {
        setModalUpdate(false);
    }

    const date = new Date();
    const day = date.getDay();

    const weekdays = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"
    ];

    const eliminarRutina = async (id_rutina) => {
        setDeleteRutina(true);
        //alert(id_rutina)
        if (confirm("¿Desea eliminar esta rutina?")) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/rutinas/deleteRutina/${id_rutina}/${id_usuario}`);
                const { message } = response.data;
                alert(message);
                setDeleteRutina(false);
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

    const marcarComoCompletada = async (id_rutina) => {
        setCountRutina(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/rutinaCompletions/insertCompletions`,
                { id_rutina, id_usuario }
            );
            const { message } = response.data;
            alert(message);
            setCountRutina(false);
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

    useEffect(() => {
        if (!id_usuario) {
            return;
        }

        const fetchRutinas = async () => {
            try {
                const reset = await axios.post(`${import.meta.env.VITE_API_URL}/api/rutinaCompletions/resetRutinas`, { id_usuario });
                const { message } = reset.data;


                const daysOfRacha = await axios.post(`${import.meta.env.VITE_API_URL}/api/rutinaCompletions/daysOfRachaDaily`, { id_usuario });


                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/rutinas/`, { id_usuario });
                const { rutinasUser, vecesCompletada } = response.data;
                const row1 = vecesCompletada[0];
                setRutinas(rutinasUser);
                setVecesCompletada(row1);


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
        };

        fetchRutinas();

    }, [id_usuario, modalOpen, deleteRutina, countRutina, modalUpdate]);


    const filteredByDay = rutinas.filter((rut) => {
        const rutina = rut.dia.toLowerCase() === weekdays[day];


        return rutina;
    })


    const excludeDay = rutinas.filter((rut) => {
        const rutina = rut.dia.toLowerCase() !== weekdays[day];
        return rutina;
    })

    const editarRutina = (rutina) => {
        setRutinasTemp(rutina);
        abrirModalUpdate();
    }


    return (
        <div className="flex h-screen">

            {/*HEADER*/}

            <Home activeOption={activeOption} setActiveOption={setActiveOption} />

            {/*Sección de visualización de rutinas*/}

            <div className="w-4/5 max-w-6xl mx-auto p-6 overflow-y-auto">
                <main className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Mis Rutinas</h1>
                        <button
                            onClick={abrirModal} // si tienes un modal para crear rutina
                            className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer"
                        >
                            Nueva Rutina
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* DÍAS DE RACHA */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                            <div className="flex items-center space-x-4">
                                <div className="bg-lime-100 text-lime-600 p-3 rounded-full">
                                    <span className="material-icons">local_fire_department</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Días de Racha</p>
                                    <p className="text-xl font-bold">
                                        {
                                            vecesCompletada?.racha_actual ?
                                                vecesCompletada?.racha_actual === 1 ? vecesCompletada?.racha_actual + " Día"
                                                    : vecesCompletada?.racha_actual + " Días"
                                                : "0 Días"

                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VECES COMPLETADA */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                            <div className="flex items-center space-x-4">
                                <div className="bg-red-100 text-red-600 p-3 rounded-full">
                                    <span className="material-icons">local_fire_department</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Racha Máxima</p>
                                    <p className="text-xl font-bold">
                                        {
                                            vecesCompletada?.racha_max ?
                                                vecesCompletada?.racha_max === 1 ? vecesCompletada?.racha_max + " Día"
                                                    : vecesCompletada?.racha_max + " Días"
                                                : "0 días"

                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Rutina para hoy</h2>
                        {filteredByDay.length > 0 ? filteredByDay.map((rutina) => (

                            <div
                                key={rutina.id_rutina}
                                className="rounded-2xl p-6 shadow-md border border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-lg"
                            >
                                {/* INFO IZQUIERDA */}
                                <div className="space-y-1 w-full md:w-2/3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-blue-600">{rutina.dia}</h3>
                                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {rutina.tipo_rutina}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 italic">{rutina.descripcion}</p>
                                    <p className="text-sm text-gray-500 italic">{rutina.completado}</p>
                                    <p className="text-sm text-gray-800">
                                        📝 <span className="font-semibold">Ejercicios:</span>{" "}
                                        {rutina.ejercicios.map((ej) => `${ej.nombre} (${ej.reps} reps, ${ej.duracion_segundos}s)`).join(" · ")}
                                    </p>
                                </div>

                                {/* INFO DERECHA */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 w-full md:w-1/3">
                                    {/* Botón de completado */}

                                    <button
                                        onClick={() => marcarComoCompletada(rutina.id_rutina)} // tu función
                                        className=
                                        {`px-4 py-2 text-sm font-medium 
                                        ${rutina.completado === 1 ? "text-green-700 hover:bg-green-500 border-green-300" : "text-red-700 hover:bg-red-500 border-red-300"} border  rounded-lg hover:text-white transition`}
                                    >
                                        {
                                            rutina.completado === 1 ? "✅ Completado" : "❌ Completado"
                                        }

                                    </button>

                                    {/* Botones de acción */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editarRutina(rutina)}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarRutina(rutina.id_rutina)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-500 hover:text-white transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (<p>No tienes rutinas para hoy</p>)}
                    </div>


                    <div className="space-y-6 mt-10 border-t border-gray-300 pt-6">
                        <h2 className="text-xl font-semibold">Mis otras rutinas</h2>
                        {excludeDay.length > 0 ? excludeDay.map((rutina) => (

                            <div
                                key={rutina.id_rutina}
                                className="bg-white rounded-2xl p-6 shadow-md border border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-lg"
                            >
                                {/* INFO IZQUIERDA */}
                                <div className="space-y-1 w-full md:w-2/3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-blue-600">{rutina.dia}</h3>
                                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {rutina.tipo_rutina}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 italic">{rutina.descripcion}</p>
                                    <p className="text-sm text-gray-800">
                                        📝 <span className="font-semibold">Ejercicios:</span>{" "}
                                        {rutina.ejercicios.map((ej) => `${ej.nombre} (${ej.reps} reps, ${ej.duracion_segundos}s)`).join(" · ")}
                                    </p>
                                </div>

                                {/* INFO DERECHA */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 w-full md:w-1/3">
                                    {/* Botón de completado */}


                                    {/* Botones de acción */}
                                    <div className="flex flex-col justify-center gap-1 items-center sm:flex-row">
                                        <button
                                            onClick={() => editarRutina(rutina)}
                                            className="px-4 py-2 w-full text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarRutina(rutina.id_rutina)}
                                            className="px-4 py-2 w-full text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-500 hover:text-white transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (<p>No tienes más rutinas</p>)}
                    </div>

                </main>



                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </div>
            {modalOpen && (
                <CreateRutina cerrarModal={cerrarModal} />
            )}

            {modalUpdate && (
                <UpdateRutina rutinasTemp={rutinasTemp} setRutinasTemp={setRutinasTemp} cerrarModalUpdate={cerrarModalUpdate} />
            )}


            {/*************************************/}
        </div>
    )
}
