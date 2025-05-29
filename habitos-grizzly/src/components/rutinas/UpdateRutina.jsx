import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios";

export const UpdateRutina = ({ rutinasTemp, setRutinasTemp, cerrarModalUpdate }) => {

    const { usuario } = useAuth();
    const id = usuario.id_usuario;
    const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);

    useEffect(() => {
        const fetchEjercicio = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ejercicios/listaEjercicios`, { id });
                setEjerciciosDisponibles(response.data);
            } catch (error) {
                if (error.response) {
                    // Error desde el servidor con status 4xx o 5xx
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

        fetchEjercicio();
    }, [id])

    const handleUpdate = (e) => {
        e.preventDefault();
        UpdateRutina(e);

    }

    const UpdateRutina = async (e) => {
        const form = e.target;
        const nombreRutina = form.nombre.value;
        const tipo_rutina = form.tipo_rutina.value;
        const descripcion = form.descripcion.value;
        const id_rutina = rutinasTemp.id_rutina;
        //const ejercicios = [];
        // Obtenemos el número de ejercicios
        const ejercicios = [];
        const totalEjercicios = rutinasTemp.ejercicios.length;

        for (let i = 0; i < totalEjercicios; i++) {
            const ejercicio = form[`ejercicio${i}`].value;
            const orden = form[`orden${i}`].value;
            const duracion_segundos = form[`duracion_segundos${i}`].value;
            const id_rutinas_ejercicios = rutinasTemp.ejercicios[i].id_rutinas_ejercicios;

            ejercicios.push({
                ejercicio,
                orden,
                duracion_segundos,
                id_rutinas_ejercicios
            });
        }

        try {

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/rutinas/updateRutina`, { nombreRutina, tipo_rutina, descripcion, ejercicios, id, id_rutina });
            const { message } = response.data;
            
            alert(message);
            cerrarModalUpdate();

        } catch (error) {
            if (error.response) {
                // Error desde el servidor con status 4xx o 5xx
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


    return (
        <div className="p-4">
            <div className="fixed inset-0 bg-transparent bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
                <div className="bg-white bg-opacity-80 rounded-lg p-6 w-full max-w-4xl shadow-lg relative">
                    <button
                        onClick={cerrarModalUpdate}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-center">Actualizar Nueva Rutina</h3>
                    <form onSubmit={handleUpdate} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block mb-1 font-medium text-gray-700">Nombre:</label>
                            <select
                                id="nombre"
                                name="nombre"
                                value={rutinasTemp?.nombre || ""}
                                onChange={(e) => setRutinasTemp({ ...rutinasTemp, nombre: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Fuerza">Fuerza</option>
                                <option value="Cardio + Tren Superior">Cardio + Tren Superior</option>
                                <option value="Cardio + Tren Intermedio">Cardio + Tren Intermedio</option>
                                <option value="Cardio + Tren Inferior">Cardio + Tren Inferior</option>
                            </select>
                        </div>

                        {/* Tipo de Rutina */}
                        <div>
                            <label htmlFor="tipo_rutina" className="block mb-1 font-medium text-gray-700">Tipo de Rutina:</label>
                            <select
                                id="tipo_rutina"
                                name="tipo_rutina"
                                value={rutinasTemp?.tipo_rutina || ""}
                                onChange={(e) => setRutinasTemp({ ...rutinasTemp, tipo_rutina: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Individual">Individual</option>
                                <option value="Mixta">Mixta</option>
                            </select>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block mb-1 font-medium text-gray-700">Descripción:</label>
                            <input
                                type="text"
                                id="descripcion"
                                name="descripcion"
                                value={rutinasTemp?.descripcion || ""}
                                onChange={(e) => setRutinasTemp({ ...rutinasTemp, descripcion: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Ejercicios */}
                        {rutinasTemp.ejercicios.map((e, idx) => (
                            <div key={e.id_ejercicio} className="border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">Ejercicio {idx + 1}</h4>

                                <label htmlFor={`ejercicio${idx}`} className="block mb-1 font-medium text-gray-700">
                                    Ejercicio:
                                </label>
                                <select
                                    id={`ejercicio${idx}`}
                                    name={`ejercicio${idx}`}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value={rutinasTemp?.ejercicios[idx].id_ejercicio || ""}
                                    >
                                        {rutinasTemp?.ejercicios[idx].nombre || ""}
                                    </option>
                                    {ejerciciosDisponibles.map((ed) => (
                                        <option key={ed.id_ejercicio} value={ed.id_ejercicio}>{ed.nombre}</option>
                                    ))}
                                </select>

                                <label htmlFor={`orden${idx}`} className="block mb-1 font-medium text-gray-700">
                                    Orden:
                                </label>
                                <input
                                    type="number"
                                    id={`orden${idx}`}
                                    name={`orden${idx}`}
                                    value={rutinasTemp?.ejercicios[idx].orden || ""}
                                    onChange={(e) => {
                                        const updatedEjercicios = [...rutinasTemp.ejercicios];
                                        updatedEjercicios[idx] = {
                                            ...updatedEjercicios[idx],
                                            orden: e.target.value
                                        };
                                        setRutinasTemp({
                                            ...rutinasTemp,
                                            ejercicios: updatedEjercicios
                                        });
                                    }}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <label htmlFor={`duracion_segundos${idx}`} className="block mb-1 font-medium text-gray-700">
                                    Duración en segundos:
                                </label>
                                <input
                                    type="number"
                                    id={`duracion_segundos${idx}`}
                                    name={`duracion_segundos${idx}`}
                                    value={rutinasTemp?.ejercicios[idx].duracion_segundos || ""}
                                    onChange={(e) => {
                                        const updatedEjercicios = [...rutinasTemp.ejercicios];
                                        updatedEjercicios[idx] = {
                                            ...updatedEjercicios[idx],
                                            duracion_segundos: e.target.value
                                        };
                                        setRutinasTemp({
                                            ...rutinasTemp,
                                            ejercicios: updatedEjercicios
                                        });
                                    }}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Actualizar
                        </button>
                    </form>
                </div>
            </div>
        </div>


    )
}
