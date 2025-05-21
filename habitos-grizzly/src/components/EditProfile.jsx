import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { Home } from "./Home";
import axios from "axios";
import { PasswordInput } from "./PasswordInput";

export const EditProfile = () => {
    const [usuarioSesion, setUsuarioSesion] = useState([]);
    const [modalOpenPassword, setModalOpenPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { usuario } = useAuth();
    const id = usuario.id_usuario;
    const { habitosBDM } = useAuth();
    const habitos = JSON.parse(localStorage.getItem("habitos") || "[]");
    const longitud = habitos.length;

    //console.log(habitosBDM.length);
    //console.log("local: ", habitos);

    const openModalPassword = () => {
        setModalOpenPassword(true);
    }

    const closeModalPassword = () => {
        setModalOpenPassword(false);
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const form = e.target;
        const oldPassword = form.oldPassword.value;
        const newPassword = form.newPassword.value;
        const newPasswordAgain = form.newPasswordAgain.value;

        try {
            const response = await axios.put('http://localhost:3001/api/user/changePassword', { oldPassword, newPassword, newPasswordAgain, id });
            const { message } = response.data;
            alert(message);
            closeModalPassword();
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

    const habitosSimplificados = habitos
        .filter(habito => habito.cumplido === 0)
        .map(({ id_habito, nombre, progreso, cumplido }) => ({
            id: id_habito,
            nombre,
            progreso,
            cumplido
        }));

    const enviarDatos = (e) => {
        e.preventDefault();
        updateUser(e);
    }

    useEffect(() => {
        if (!id) return;

        /*if (efectoEjecutado.current) return; // evita segunda ejecución en modo dev
        efectoEjecutado.current = true;*/

        fetch("http://localhost:3001/api/userById/usuarioPorId", {
            method: "POST",
            //el tipo de contenido
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => {
                //validamos los datos obtenidos
                setUsuarioSesion(data.usuario);
                //console.log("obtener", data.usuario);
                //setHabits(data);
                //console.log(data);

            })
            .catch((err) => {
                console.error("Error al traer usuario: ", err);
                /*setCargandoHabitos(false)*/
            });
    }, [id]); //Se vuelve a ejecutar tras agregar o actualizar

    const habitosPorCumplir = habitosSimplificados.length;

    const updateUser = async (e) => {
        e.preventDefault();
        const form = e.target;
        const nombre = form.nombre.value;
        const correo = form.correo.value;
        const id_usuario = usuario.id_usuario;

        await fetch("http://localhost:3001/api/updateUsuario/usuarioUpdate", {
            method: "PUT",
            //el tipo de contenido
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, id_usuario })
        })
            .then((res) => res.json())
            .then((data2) => {
                // console.log(conteo, ": ", data);
                //console.log("en actualizar: ", data2);
                alert("Datos actualizados");
                form.correo.value = "";
                form.nombre.value = "";
                setUsuarioSesion(data2.rows[0]);
            })
    }
    //console.log(usuarioSesion);

    return (

        <>


            <div className="flex h-screen">
                <Home />

                <div className="w-4/5 max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* SECCIÓN 1: Info Personal */}
                    <div className="col-span-2 bg-white rounded-2xl shadow p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-neutral-800">Editar Perfil</h2>
                        <form onSubmit={enviarDatos} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    name="nombre"
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-neutral-400 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                                <input
                                    name="correo"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-neutral-400 focus:outline-none"
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="bg-neutral-800 text-white px-6 py-2 rounded-lg hover:bg-neutral-700 transition">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* SECCIÓN 2: Panel lateral */}
                    <div className="space-y-6">

                        {/* Bienvenida */}
                        <div className="bg-gradient-to-br from-neutral-800 to-gray-700 text-white p-5 rounded-2xl shadow">
                            <h3 className="text-lg font-semibold">¡Hola, {usuarioSesion.nombre}!</h3>
                            <p className="text-sm mt-1">Tu meta diaria: <strong>Completar 3 hábitos</strong></p>
                            {habitosPorCumplir === 0
                                ? <p className="text-sm mt-1">Aún no tienes <strong>hábitos</strong> registrados</p>
                                : <p className="text-sm mt-1">Aún te {habitosPorCumplir === 1 ? "falta" : "faltan"} <strong>{habitosPorCumplir} {habitosPorCumplir === 1 ? "hábito" : "hábitos"}</strong> por cumplir 💪</p>}
                        </div>

                        {/* Configuraciones */}
                        <div className="bg-white p-5 rounded-2xl shadow space-y-2">
                            <h4 className="font-semibold text-neutral-800">Preferencias</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><button className="hover:underline">Modo oscuro (próximamente)</button></li>
                                <li><button className="hover:underline">Notificaciones</button></li>
                                <li><button className="hover:underline">Idioma</button></li>
                            </ul>
                        </div>

                        {/* Seguridad */}
                        <div className="bg-white p-5 rounded-2xl shadow space-y-2">
                            <h4 className="font-semibold text-neutral-800">Seguridad</h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><button onClick={openModalPassword} className="hover:underline cursor-pointer">Cambiar contraseña</button></li>
                            </ul>
                        </div>

                        {/* Recompensas */}
                        <div className="bg-white p-5 rounded-2xl shadow space-y-2">
                            <h4 className="font-semibold text-neutral-800">Recompensas</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">🔥 Constancia</span>
                                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">💎 Maestro del hábito</span>
                                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">⏰ Puntualidad</span>
                            </div>
                        </div>
                    </div>
                </div>

                {modalOpenPassword && (
                    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto p-8 relative">
                            <button
                                onClick={closeModalPassword}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Cerrar"
                            >
                                &times;
                            </button>

                            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Actualizar Contraseña</h3>

                            <form onSubmit={handleChangePassword} className="flex flex-col gap-y-6">

                                {/* Nombre */}
                                <div className="flex flex-col">
                                    <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">Contraseña actual</label>
                                    <PasswordInput
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="********"
                                        name="oldPassword"
                                        id="oldPassword"
                                    />
                                </div>

                                {/* Descripción */}
                                <div className="flex flex-col">
                                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">Nueva contraseña</label>
                                    <PasswordInput
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder="********"
                                    />
                                </div>

                                {/* Fecha Inicio */}
                                <div className="flex flex-col">
                                    <label htmlFor="newPasswordAgain" className="text-sm font-medium text-gray-700">Nueva contraseña</label>
                                    <PasswordInput
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="********"
                                        name="newPasswordAgain"
                                        id="newPasswordAgain"
                                    />
                                </div>

                                {/* Botón */}
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 cursor-pointer"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


            </div>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>


        </>

    )
}
