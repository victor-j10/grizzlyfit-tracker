//Import de componentes y librerías como react-router-dom --> hecha para enrutamiento de componentes.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./components/Home";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import { HabitList } from "./components/HabitList";
import { EditProfile } from "./components/EditProfile";
import { ExcercisesList } from "./components/excercises/ExcercisesList";
import { RutinaList } from "./components/rutinas/RutinasList";
import { ForgotPassword } from "./pages/ForgotPassword";
import { RecoverPassword } from "./pages/RecoverPassword";
import { Register } from "./pages/Register";


//función app, que hace referencia a la vista que se muestra en el servidor.
function App() {
  return (
    //router para encerrar las vistas/componentes. con eso se puede utilizar el entrutamiento en cualquier de ellas
    //el AuthProvider permite que, en las demás se puedan llamar los metodos que la componen.
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/forgotPassword" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/recoverPassword" element={
            <PublicRoute>
              <RecoverPassword />
            </PublicRoute>
          } />
          <Route path="/habitList" element={
            <PrivateRoute>
              {/*<Home />*/}
              <HabitList />
            </PrivateRoute>
          } />
          <Route path="/editProfile" element={
            <PrivateRoute>
              {/*<Home />*/}
              <EditProfile />
            </PrivateRoute>
          } />
          <Route path="/ejercicioList" element={
            <PrivateRoute>
              {/*<Home />*/}
              <ExcercisesList />
            </PrivateRoute>
          } />
          <Route path="/gestionRutina" element={
            <PrivateRoute>
              {/* <Home />*/}
              <RutinaList />
            </PrivateRoute>
          } />
          <Route path="/login" element={<PublicRoute>
            <Login />
          </PublicRoute>} />
          <Route path="/register" element={<PublicRoute>
            <Register />
          </PublicRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

