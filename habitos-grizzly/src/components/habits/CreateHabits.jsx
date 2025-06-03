import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export const CreateHabits = ({ cerrarModal }) => {

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
        const fecha_inicio = form.fecha_inicio.value;
        const fecha_fin = form.fecha_fin.value;
        const progreso = 0;
        const cumplido = 0;
        const categoria = form.categoria.value;
        const id_usuario = usuario.id_usuario;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits/insertHabito`,
                { nombre, descripcion, fecha_inicio, fecha_fin, progreso, cumplido, categoria, id_usuario });

            const { message } = response.data;
            alert(message);
            

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
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto p-8 relative">
                <button
                    onClick={cerrarModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Crear Hábito</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Ingresa el nombre"
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            placeholder="Escribe una descripción"
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Fecha Inicio */}
                    <div className="flex flex-col">
                        <label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input
                            type="date"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div className="flex flex-col">
                        <label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input
                            type="date"
                            id="fecha_fin"
                            name="fecha_fin"
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1"
                        />
                    </div>

                    {/* Cumplido */}
                    <div className="flex flex-col">
                        <label htmlFor="cumplido" className="text-sm font-medium text-gray-700">¿Cumplido?</label>
                        <select
                            id="cumplido"
                            name="cumplido"
                            className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1 bg-transparent"
                        >
                            <option value="">Selecciona</option>
                            <option value="1">Cumplido</option>
                            <option value="0">No cumplido</option>
                        </select>
                    </div>

                    {/* Categoría */}
                    <div className="flex flex-col">
                        <label htmlFor="categoria" className="text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            id="categoria"
                            name="categoria"
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
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
