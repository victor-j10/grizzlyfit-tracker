import React from 'react'
import { useAuth } from '../../contexts/AuthContext';

export const CreateExcercises = ({ cerrarModal }) => {

    const { usuario } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        registrar(e);
        cerrarModal();
    };

    const registrar = async (e) => {
        e.preventDefault();
        const form = e.target;
        const nombre = form.nombre.value;
        const descripcion = form.descripcion.value;
        const categoria = form.categoria.value;
        const sets = form.sets.value;
        const reps = form.reps.value;
        const id_usuario = usuario.id_usuario;

        try {
            const res = await fetch("http://localhost:3001/api/excerciseInsert/insertExcercise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion, categoria, sets, reps, id_usuario })
            });

            const data = await res.json();
            alert(data.message);

        } catch (err) {
            console.error("Error al insertar el ejercicio", err);
        }
    }

    return (

        <div className="p-4">

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                    <button
                        onClick={cerrarModal}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-center">Registrar Nuevo Ejercicio</h3>
                    <form onSubmit={handleSubmit}>
                        {/*Nombre*/}
                        <label htmlFor="nombre" className="block mb-1 font-medium text-gray-700">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/********/}

                        {/*Descripción*/}
                        <label htmlFor="descripcion" className="block mb-1 font-medium text-gray-700">
                            Descripción:
                        </label>
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        {/*Categoría*/}
                        <label htmlFor="categoria" className="block mb-1 font-medium text-gray-700">
                            Categoría:
                        </label>
                        <select
                            id="categoria"
                            name="categoria"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Pecho">Pecho</option>
                            <option value="Abdomen">Abdomen</option>
                            <option value="Piernas">Piernas</option>
                        </select>
                        {/*******/}

                        {/*sets*/}
                        <label htmlFor="sets" className="block mb-1 font-medium text-gray-700">
                            Sets:
                        </label>
                        <input
                            type="number"
                            id="sets"
                            name="sets"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        {/*reps*/}
                        <label htmlFor="reps" className="block mb-1 font-medium text-gray-700">
                            Reps:
                        </label>
                        <input
                            type="number"
                            id="reps"
                            name="reps"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
}
