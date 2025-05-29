import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext";
import { CreateExcercises } from "./CreateExcercises";
import { UpdateExcercises } from "./UpdateExcercises";
import { useNavigate } from "react-router-dom";
import { Home } from "../Home";

export const ExcercisesList = () => {

    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosUnique, setEjerciciosUnique] = useState([]);
    const [ejerciciosBusqueda, setEjerciciosBusqueda] = useState([]);
    const [filtro, setFiltro] = useState("Todos");
    const { usuario } = useAuth();
    const id = usuario.id_usuario;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
    const [ejercicioDelete, setEjercicioDelete] = useState(false);
    const [activeOption, setActiveOption] = useState('ejercicioList');
    const defaultValor = "";
    const navigate = useNavigate();

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

    const cambiarEstado = () => {
        setEjercicioDelete(false);
    }

    const obtenerEjercicio = (ejercicio) => {
        abrirModalUpdate();
        //console.log(ejercicio);
        setEjerciciosUnique(ejercicio);
    }

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch("http://localhost:3001/api/ejercicios/listaEjercicios", {
            method: "POST",
            //el tipo de contenido
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => {
                //validamos los datos obtenidos
                setEjercicios(data);
                //actualizarProgresoEnBd(data);
                //setHabits(data);
                //console.log(data);

            })
            .catch((err) => {
                console.error("Error al traer habitos: ", err);
                /*setCargandoHabitos(false)*/
            });

    }, [id, modalOpen, modalOpenUpdate, ejercicioDelete]);

    const eliminar = async (id_ejercicio) => {
        setEjercicioDelete(true);
        if (confirm("¿Desea eliminar este ejercicio?")) {
            const res = await fetch(`http://localhost:3001/api/excerciseDelete/deleteExcercise/${id_ejercicio}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_ejercicio: id_ejercicio }),
            });

            const data = await res.json();
            alert("Ejercicio eliminado");
            setEjercicioDelete(false);
        }
    }

    const buscarPorNombre = (e) => {
        //alert(e);
        //console.log("valor al buscar: ", filtroCategoria);
        const resultados = ejercicios.filter(ejercicio =>
            ejercicio.nombre.toLowerCase().includes(e.toLowerCase())
        );
        setEjerciciosBusqueda(resultados);
        buscar.value = "";
    };

    const navegar = () => {

        navigate("/gestionRutina");
    }

    const filtrarEjercicios = (ejercicio) => {
        if (filtro === 'todos') return true;
        if (filtro === 'pecho') return ejercicio.categoria === "Pecho";
        if (filtro === 'abdomen') return ejercicio.categoria === "Abdomen";
        if (filtro === 'cardio') return ejercicio.categoria === "Cardio";
        if (filtro === 'piernas') return ejercicio.categoria === "Piernas" || ""
        return true;
    };

    const filtrarPorCategoria = (categoria) => {
        console.log(categoria);
        console.log(ejerciciosBusqueda.length);

        //1. Validar categoria --> si el ejercicios busqueda es menor que cero quiere decir que el filtro de la busqueda no ha sido usado

        console.log("sigue");
        fetch("http://localhost:3001/api/ejerciciosByCategoria/listaEjerciciosPorCategoria", {
            method: "POST",
            //el tipo de contenido
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoria, id })
        })
            .then((res) => res.json())
            .then((data) => {
                //validamos que el array esté lleno
                if (data.length > 0) {
                    if (!categoria) {
                        categoriaFiltro.value = ""
                        setEjercicios(data);
                        setEjerciciosBusqueda([]);
                        console.log("nuevo valor: ", ejerciciosBusqueda.length)
                    } else if (ejerciciosBusqueda.length > 0) {
                        //console.log(ejerciciosBusqueda[0].categoria);
                        //validar aquí también valores dentro del array temporal
                        //se soluciona con un map
                        const resultados = ejerciciosBusqueda.filter(ejercicio =>
                            ejercicio.categoria.toLowerCase().includes(categoria.toLowerCase())
                        );
                        setEjerciciosBusqueda(resultados);
                    } else {
                        setEjercicios(data);
                    }
                    //

                    //console.log(data);
                    //console.log(categoria);
                    /*console.log(JSON.stringify({ categoria, id }));*/
                    //si no, le decimos que no existen datos con esa categoría
                } else {
                    alert("No existen datos con la categoría seleccionada");
                }
            })
            .catch((err) => {
                console.error("Error al traer habitos: ", err);
                /*setCargandoHabitos(false)*/
            });
    }


    return (
        <div className="flex h-screen">

            <Home activeOption={activeOption} setActiveOption={setActiveOption} />
            {/*HEADER*/}

            <main className="flex-1 p-6 overflow-y-auto">
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
                                {/* 
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
Estado */}
                                {/* Botones */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => obtenerEjercicio(ejercicio)}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                    >
                                        Actualizar
                                    </button>
                                    <button
                                        onClick={eliminar}
                                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
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

            {modalOpen && (
                <CreateExcercises cerrarModal={cerrarModal} />
            )}

            {modalOpenUpdate && (
                <UpdateExcercises cerrarModalUpdate={cerrarModalUpdate} ejerciciosUnique={ejerciciosUnique} setEjerciciosUnique={setEjerciciosUnique} />
            )}
        </div>

    )
}
