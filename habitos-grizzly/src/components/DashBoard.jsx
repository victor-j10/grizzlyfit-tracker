import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Home } from "./Home";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import axios from "axios";

export const DashBoard = () => {
    const { usuario } = useAuth();
    const id = usuario.id_usuario;
    const [activeOption, setActiveOption] = useState('dashboard');
    const [habits, setHabits] = useState([]);
    const [excercises, setExcercises] = useState([]);
    const [rutinas, setRutinas] = useState([]);
    const colores = ['#84cc16', '#bef264']; // Verde oscuro y verde claro

    useEffect(() => {
        if (!id) return;
        const fetchHabitsExcercises = async () => {
            try {
                const responseHabits = await axios.post('http://localhost:3001/api/habitsById/listaHabitos', { id });
                setHabits(responseHabits.data);

                const responseExcercises = await axios.post('http://localhost:3001/api/ejercicios/listaEjercicios', { id });
                setExcercises(responseExcercises.data);

                const id_usuario = id;
                const responseRutinas = await axios.post('http://localhost:3001/api/rutinas/', { id_usuario });
                const { rutinasUser } = responseRutinas.data;
                setRutinas(rutinasUser);
                console.log(rutinasUser);

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
        fetchHabitsExcercises();
    }, [id]);

    const categoriasData = habits.reduce((acc, habit) => {
        const categoria = habit.categoria || "Sin categoría";
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
    }, {});

    const dataGrafico = Object.entries(categoriasData).map(([categoria, total]) => ({
        categoria,
        total
    }));

    const categoriasDataExcercises = excercises.reduce((acc, exe) => {
        const categoria = exe.categoria || "Sin categoría";
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
    }, {});

    const dataGraficoE = Object.entries(categoriasDataExcercises).map(([categoria, total]) => ({
        categoria,
        total
    }));

    const dataVolumen = excercises.reduce((acc, ej) => {
        const volumen = ej.reps * ej.sets;
        const existente = acc.find(a => a.categoria === ej.categoria);

        if (existente) {
            existente.total += volumen;
        } else {
            acc.push({ categoria: ej.categoria, total: volumen });
        }

        return acc;
    }, []);

    const tiposRutina = rutinas.reduce((acc, rutina) => {
        const tipo = rutina.tipo_rutina;
        const existente = acc.find(r => r.tipo === tipo);

        if (existente) {
            existente.total++;
        } else {
            acc.push({ tipo, total: 1 });
        }

        return acc;
    }, []);

    const porcentaje2 = Math.floor((habits.filter(h => h.cumplido === 1).length / habits.length) * 100) || 0;
    const porcentaje = Math.floor((habits.filter(h => h.progreso === 100).length / habits.length) * 100) || 0;
    const porcentaje3 = Math.floor((rutinas.length / 7) * 100) || 0;
    const radius = 60;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (porcentaje / 100) * circumference;
    const strokeDashoffset2 = circumference - (porcentaje2 / 100) * circumference;
    const strokeDashoffset3 = circumference - (porcentaje3 / 100) * circumference;


    return (
        <>
            <div className="flex h-screen">

                <Home activeOption={activeOption} setActiveOption={setActiveOption} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Dashboard de Hábitos</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Cumplidos */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
                                    <span className="material-icons">numbers</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Hábitos</p>
                                    <p className="text-xl font-bold">
                                        {habits.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 pt-6">

                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Tendencias Hábitos</h1>
                        </div>

                        {/* Sección de progreso mensual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Progreso mensual */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-2">Progreso Estimado</h2>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-36 h-36">
                                        <svg height="100%" width="100%" viewBox="0 0 120 120">
                                            {/* Fondo gris */}
                                            <circle
                                                stroke="#e5e7eb"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={0}
                                            />
                                            {/* Progreso verde */}
                                            <circle
                                                stroke="#84cc16"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-lime-600">{porcentaje}%</span>
                                        </div>
                                    </div>


                                    <p className="mt-4 text-sm text-gray-500">Porcentaje de hábitos cumplidos</p>
                                </div>
                            </div>

                            {/* Progreso mensual */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-2">Progreso Real</h2>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-36 h-36">
                                        <svg height="100%" width="100%" viewBox="0 0 120 120">
                                            {/* Fondo gris */}
                                            <circle
                                                stroke="#e5e7eb"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={0}
                                            />
                                            {/* Progreso verde */}
                                            <circle
                                                stroke="#84cc16"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset2}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-lime-600">{porcentaje2}%</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500">Porcentaje de hábitos cumplidos</p>
                                </div>
                            </div>

                            {/* Gráfico mensual (placeholder, puedes usar Recharts o Chart.js) */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-2">Hábitos por Categoría</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dataGrafico}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="categoria" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#84cc16" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 mt-10 pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Tendencias Ejercicios</h1>
                        </div>

                        {/* Sección de progreso mensual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Progreso general */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-2">Volumen Total por Categoría</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dataVolumen}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="categoria" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#84cc16" /> {/* Azul cielo */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>


                            {/* Gráfico mensual (placeholder, puedes usar Recharts o Chart.js) */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-2">Ejercicios por Categoría</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dataGraficoE}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="categoria" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#84cc16" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 mt-10 pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Tendencias Rutinas</h1>
                        </div>



                        {/* Sección de progreso mensual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Porcentaje de rutinas en la semana */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-4 text-center">Porcentaje de Rutinas</h2>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-36 h-36">
                                        <svg height="100%" width="100%" viewBox="0 0 120 120">
                                            {/* Fondo gris */}
                                            <circle
                                                stroke="#e5e7eb"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={0}
                                            />
                                            {/* Progreso verde */}
                                            <circle
                                                stroke="#84cc16"
                                                fill="transparent"
                                                strokeWidth={stroke}
                                                r={normalizedRadius}
                                                cx="60"
                                                cy="60"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset3}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-lime-600">{porcentaje3}%</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500 text-center">
                                        Porcentaje de días de la semana con al menos una rutina
                                    </p>
                                </div>
                            </div>

                            {/* Tipos de rutina */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-lg font-semibold mb-4 text-center">Tipos de Rutinas</h2>
                                <div className="flex justify-center">
                                    <PieChart width={250} height={250}>
                                        <Pie
                                            data={tiposRutina}
                                            dataKey="total"
                                            nameKey="tipo"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {tiposRutina.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>

            </div >

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        </>
    )
}
