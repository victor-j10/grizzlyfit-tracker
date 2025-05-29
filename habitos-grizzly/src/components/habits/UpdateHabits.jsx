export const UpdateHabits = ({ cerrarModalUpdate, habitUnique, setHabitUnique }) => {
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        actualizar(e);
        cerrarModalUpdate();
    }

    const actualizar = async (e) => {
        e.preventDefault();
        //console.log("actualizar:", habitUnique);
        //setHabitUnique(actualizarProgresoUniqueEnBd(habitUnique));
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/habitUpdate/updateHabit/${habitUnique.id_habito}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(habitUnique),
        });

        const data = await res.json();
        alert("Hábito actualizado");

    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto p-8 relative">
                <button
                    onClick={cerrarModalUpdate}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Actualizar Hábito</h3>

                <form onSubmit={handleSubmitUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="nombreUpdate" className="text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombreUpdate"
                            name="nombreUpdate"
                            placeholder="Ingresa el nombre"
                            value={habitUnique?.nombre || ""}
                            onChange={(e) => setHabitUnique({ ...habitUnique, nombre: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label htmlFor="descripcionUpdate" className="text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            id="descripcionUpdate"
                            name="descripcionUpdate"
                            placeholder="Escribe una descripción"
                            value={habitUnique?.descripcion || ""}
                            onChange={(e) => setHabitUnique({ ...habitUnique, descripcion: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Fecha Inicio */}
                    <div className="flex flex-col">
                        <label htmlFor="fecha_inicioUpdate" className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input
                            type="date"
                            id="fecha_inicioUpdate"
                            name="fecha_inicioUpdate"
                            value={habitUnique?.fecha_inicio.split('T')[0] || ""}
                            onChange={(e) => setHabitUnique({ ...habitUnique, fecha_inicio: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div className="flex flex-col">
                        <label htmlFor="fecha_finUpdate" className="text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input
                            type="date"
                            id="fecha_finUpdate"
                            name="fecha_finUpdate"
                            value={habitUnique?.fecha_fin.split('T')[0] || ""}
                            onChange={(e) => setHabitUnique({ ...habitUnique, fecha_fin: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Cumplido */}
                    <div className="flex flex-col">
                        <label htmlFor="cumplidoUpdate" className="text-sm font-medium text-gray-700">¿Cumplido?</label>
                        <select
                            id="cumplidoUpdate"
                            name="cumplidoUpdate"
                            value={habitUnique?.cumplido === 1 ? "1" : "0"}
                            onChange={(e) => setHabitUnique({ ...habitUnique, cumplido: Number(e.target.value) })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1 bg-transparent"
                        >
                            <option value="">Selecciona</option>
                            <option value="1">Cumplido</option>
                            <option value="0">No cumplido</option>
                        </select>
                    </div>

                    {/* Categoría */}
                    <div className="flex flex-col">
                        <label htmlFor="categoriaUpdate" className="text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            id="categoriaUpdate"
                            name="categoriaUpdate"
                            value={habitUnique?.categoria || ""}
                            onChange={(e) => setHabitUnique({ ...habitUnique, categoria: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1 bg-transparent"
                        >
                            <option value="">Selecciona</option>
                            <option value="Estudios">Estudios</option>
                            <option value="Creativo">Creativo</option>
                            <option value="Relajación">Relajación</option>
                            <option value="Música">Música</option>
                            <option value="Trabajo">Trabajo</option>
                        </select>
                    </div>

                    {/* Botón */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                        >
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
