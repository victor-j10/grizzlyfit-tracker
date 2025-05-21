import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { InsertExcerciseToRutina } from './InsertExcerciseToRutina';

export const CreateRutina = ({ cerrarModal }) => {
    const { usuario } = useAuth();
    const [modalOpenExcercises, setModalOpenExcercises] = useState(false);
    const [idRutina, setIdRutina] = useState(null);

    const abrirModalOpenE = (id_rutina) => {
        setModalOpenExcercises(true);
        setIdRutina(id_rutina);
    }

    const cerrarModalOpenE = () => {
        setModalOpenExcercises(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        registrar(e);
    };

    const registrar = async (e) => {
        e.preventDefault();
        const form = e.target;
        const nombre = form.nombre.value;
        const tipo_rutina = form.tipo_rutina.value;
        const dia = form.dia.value;
        const descripcion = form.descripcion.value;
        const id_usuario = usuario.id_usuario;

        try {
            const res = await fetch("http://localhost:3001/api/rutinas/rutinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipo_rutina, dia, descripcion, id_usuario })
            });

            const data = await res.json();
            const id_rutina = data.id_rutina;
            form.nombre.value = "";
            form.tipo_rutina.value = "";
            form.dia.value = "";
            form.descripcion.value = "";
            alert(data.message);
            console.log(data);
            if (!id_rutina) {
                return cerrarModal();
            }
            abrirModalOpenE(id_rutina);

        } catch (err) {
            console.error("Error al crear la rutina", err);
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
                    <h3 className="text-lg font-semibold mb-4 text-center">Registrar Nuevo Rutina</h3>
                    <form onSubmit={handleSubmit}>
                        {/*Nombre*/}
                        <label htmlFor="nombre" className="block mb-1 font-medium text-gray-700">
                            Nombre:
                        </label>
                        <select
                            id="nombre"
                            name="nombre"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Cardio">Cardio</option>
                            <option value="Fuerza">Fuerza</option>
                            <option value="Cardio + Tren Superior">Cardio + Tren Superior</option>
                            <option value="Cardio + Tren Intermedio">Cardio + Tren Intermedio</option>
                            <option value="Cardio + Tren Inferior">Cardio + Tren Inferior</option>
                        </select>
                        {/*******/}

                        {/*Categoría*/}
                        <label htmlFor="tipo_rutina" className="block mb-1 font-medium text-gray-700">
                            Tipo de Rutina:
                        </label>
                        <select
                            id="tipo_rutina"
                            name="tipo_rutina"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Individual">Individual</option>
                            <option value="Mixta">Mixta</option>
                        </select>
                        {/*******/}

                        {/*dia*/}
                        <label htmlFor="dia" className="block mb-1 font-medium text-gray-700">
                            Día:
                        </label>
                        <select
                            id="dia"
                            name="dia"
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Selecciona un día</option>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miercoles">Miercoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sabado">Sabado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                        {/*******/}

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

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {modalOpenExcercises && (
                <InsertExcerciseToRutina cerrarModalOpenE={cerrarModalOpenE} idRutina={idRutina} />
            )}

        </div>
    )
}
