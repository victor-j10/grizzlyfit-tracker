import axios from "axios";
import { useState } from "react";

export const ForgotPassword = () => {
    const [modalMessage, setModalMessage] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const cerrarModalMessage = () => {
        setModalMessage(false);
    }

    const handleSubmitForgot = (e) => {
        e.preventDefault();
        recoverPasswordGo(e);
    }

    const recoverPasswordGo = async (e) => {
        console.log("hola");
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;


        //setModalMessage(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/forgotPassword`, { email });
            const { message } = response.data;
            setMensaje(message);
            setModalMessage(true);

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
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex w-full max-w-5xl shadow-lg bg-white rounded-lg overflow-hidden">

                <div className="w-full md:w-1/2 p-8">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-lime-100 rounded-full">
                        <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v1.586l-.707.707A1 1 0 004 12h12a1 1 0 00.707-1.707L16 9.586V8a6 6 0 00-6-6zM8 16a2 2 0 104 0H8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center">Recover your password</h2>
                    <p className="text-center text-gray-500 mb-6">Please enter your email to continue</p>

                    <form onSubmit={handleSubmitForgot} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input name="email" id="email" type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" />
                        </div>

                        <button type="submit" className="w-full py-2 bg-lime-600 hover:bg-lime-400 text-white rounded-lg font-semibold cursor-pointer">Recover It</button>
                    </form>
                </div>

                <div className="hidden md:block md:w-1/2 relative">
                    <img src="/osito-grizzly-forgot-password.png" alt="Graduation" className="h-full w-full object-cover" />

                </div>
            </div>

            {modalMessage && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto p-8 relative">
                        <button
                            onClick={cerrarModalMessage}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">Revisa tu email</h3>

                        <p className="text-2xl font-semibold text-center text-gray-800 mb-8">{mensaje}</p>


                    </div>
                </div>
            )}
        </div>
    )
}
