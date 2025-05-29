import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"

export const InsertExcerciseToRutina = ({ cerrarModalOpenE, idRutina }) => {
    const { usuario } = useAuth();
    const id_usuario = usuario.id_usuario;
    const id = id_usuario;
    const id_rutina = idRutina;
    const [ejercicio, setEjercicio] = useState([]);

    

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/ejerciciosById/listaEjercicios`, {
            method: "POST",
            //el tipo de contenido
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => {
                //validamos los datos obtenidos
                setEjercicio(data);
                //actualizarProgresoEnBd(data);
                //setHabits(data);
                

            })
            .catch((err) => {
                console.error("Error al traer habitos: ", err);
                /*setCargandoHabitos(false)*/
            });

    }, [id_usuario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        registrar(e);
    };

    const registrar = async (e) => {
        e.preventDefault();
        const form = e.target;
        const rutina_id = id_rutina;
        const ejercicio_id = form.ejercicio.value;
        const orden = form.orden.value;
        const duracion_segundos = form.duracion_segundos.value;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rutinas/insertEjercicios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rutina_id, ejercicio_id, orden, duracion_segundos })
            });
            form.ejercicio.value = "";
            form.orden.value = null;
            form.duracion_segundos.value = null;
            const data = await res.json();
            alert(data.message);

        } catch (err) {
            console.error("Error al crear la rutina", err);
        }
    }


    return (
        <div className="p-4">

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                    <button
                        onClick={cerrarModalOpenE}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-center">Ingresar ejercicios</h3>
                    <form onSubmit={handleSubmit}>

                        {/*Categoría*/}
                        <label htmlFor="ejercicio" className="block mb-1 font-medium text-gray-700">
                            Ejercicio:
                        </label>
                        <select
                            id="ejercicio"
                            name="ejercicio"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona una opción</option>
                            {ejercicio.map((e) => (
                                <option key={e.id_ejercicio} value={e.id_ejercicio}>{e.nombre}</option>
                            ))};
                        </select>
                        {/*******/}

                        {/*Descripción*/}
                        <label htmlFor="orden" className="block mb-1 font-medium text-gray-700">
                            Orden:
                        </label>
                        <input
                            type="number"
                            id="orden"
                            name="orden"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        {/*Descripción*/}
                        <label htmlFor="duracion_segundos" className="block mb-1 font-medium text-gray-700">
                            Duración en segundos:
                        </label>
                        <input
                            type="number"
                            id="duracion_segundos"
                            name="duracion_segundos"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}
