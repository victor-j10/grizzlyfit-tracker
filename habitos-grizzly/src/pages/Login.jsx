//importamos useState para guardar y mostrar los datos de la respuesta de la api.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
//funcion Login.
export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    //declaramos las variables del useState.
    const [mensaje, setMensaje] = useState("");

    const forgotPassword = () => {
        navigate("/forgotPassword");
    }

    const register = () => {
        navigate("/register");
    }

    //creamos la función saludar, async/await, para cuando el user oprima el submit.
    const saludar = async (e) => {
        //atrapar errores
        e.preventDefault();
        //capturamos las variables que vienen desde el forms
        const form = e.target;
        const correo = form.email.value;
        const password = form.password.value;

        //try catch para realizarla conexión a la api.
        try {
            //activamos el await utilizando un fetch (metodo usado para acceder a las api's)
            const res = await fetch("http://localhost:3001/api/user/usuarios", {
                //le indicamos el método por el cual viajan las variables
                method: "POST",
                //el tipo de contenido
                headers: { "Content-Type": "application/json" },
                //armamos un cuerpo JSON y lo enviamos.
                body: JSON.stringify({ correo, password })
            });

            //if para validar la respuesta. si hay algún error lo mostramos aquí.
            //este if es general, abarca errores de "correo inválido", "contraseña inválida", "campos vacíos"
            if (!res.ok) {
                //guardamos el error en una variable
                const errorData = await res.json();
                alert(errorData.error || "Error de autenticación");
                return;
            }

            //si todo está correcto se salta el if y podemos guardar los datos
            const data = await res.json();
            //seteamos el estado de la variable y guardamos los datos obtenidos en el json.
            setMensaje(data.usuario);
            //accedemos a estos por medio de su estructura
            //console.log("Bienvenido: ", data.usuario.nombre);
            login(data.usuario, data.token);
            navigate("/habitList");

        } catch (err) {
            console.error('Error al traer el usuario: ', err);
            alert('Usuario no encontrado o error de conexión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex w-full max-w-5xl shadow-lg bg-white rounded-lg overflow-hidden">

                <div className="w-full md:w-1/2 p-8">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-lime-100 rounded-full">
                        <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v1.586l-.707.707A1 1 0 004 12h12a1 1 0 00.707-1.707L16 9.586V8a6 6 0 00-6-6zM8 16a2 2 0 104 0H8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Please sign in to continue</p>

                    <form onSubmit={saludar} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input name="email" id="email" type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input name="password" id="password" type="password" placeholder="********" className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400" />
                        </div>

                        <button type="submit" className="w-full py-2 bg-lime-600 hover:bg-lime-400 text-white rounded-lg font-semibold cursor-pointer">Sign In</button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        <a onClick={forgotPassword} className="text-lime-600 hover:underline cursor-pointer">Forgot your password?</a>
                    </p>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account? &nbsp;
                        <a onClick={register} className="text-lime-600 hover:underline cursor-pointer">Sign up</a>
                    </p>
                </div>

                <div className="hidden md:block md:w-1/2 relative">
                    <img src="/osito-grizzly.png" alt="Graduation" className="h-full w-full object-cover" />

                </div>
            </div>
        </div>

    );
}
