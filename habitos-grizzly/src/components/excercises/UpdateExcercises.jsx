export const UpdateExcercises = ({ cerrarModalUpdate, ejerciciosUnique, setEjerciciosUnique }) => {
    
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        actualizar(e);
        cerrarModalUpdate();
    }

    const actualizar = async (e) => {
        e.preventDefault();
        //setHabitUnique(actualizarProgresoUniqueEnBd(habitUnique));
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/excerciseUpdate/updateExcercise/${ejerciciosUnique.id_ejercicio}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ejerciciosUnique),
        });

        const data = await res.json();
        alert("Ejercicio actualizado");

    }

    return (
        <div className="p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                    <button
                        onClick={cerrarModalUpdate}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-center">Actualizar Hábito</h3>
                    <form onSubmit={handleSubmitUpdate}>
                        {/*Nombre*/}
                        <label htmlFor="nombreUpdate" className="block mb-1 font-medium text-gray-700">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            value={ejerciciosUnique?.nombre}
                            onChange={(e) => setEjerciciosUnique({ ...ejerciciosUnique, nombre: e.target.value })}
                            id="nombreUpdate"
                            name="nombreUpdate"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/********/}

                        {/*Descripción*/}
                        <label htmlFor="descripcionUpdate" className="block mb-1 font-medium text-gray-700">
                            Descripción:
                        </label>
                        <input
                            type="text"
                            value={ejerciciosUnique?.descripcion || ""}
                            onChange={(e) => setEjerciciosUnique({ ...ejerciciosUnique, descripcion: e.target.value })}
                            id="descripcionUpdate"
                            name="descripcionUpdate"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        {/*Categoría*/}
                        <label htmlFor="categoriaUpdate" className="block mb-1 font-medium text-gray-700">
                            Categoría:
                        </label>
                        <select
                            id="categoriaUpdate"
                            name="categoriaUpdate"
                            value={ejerciciosUnique?.categoria || ""}
                            onChange={(e) => setEjerciciosUnique({ ...ejerciciosUnique, categoria: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Pechos">Pechos</option>
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
                            value={ejerciciosUnique?.sets}
                            onChange={(e) => setEjerciciosUnique({ ...ejerciciosUnique, sets: e.target.value })}
                            id="sets"
                            name="sets"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/*******/}

                        {/*Fecha_FIN*/}
                        <label htmlFor="reps" className="block mb-1 font-medium text-gray-700">
                            Reps:
                        </label>
                        <input
                            type="number"
                            value={ejerciciosUnique?.reps}
                            onChange={(e) => setEjerciciosUnique({ ...ejerciciosUnique, reps: e.target.value })}
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
                            Actualizar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
