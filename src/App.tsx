import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRedirect from "./components/Auth/AuthRedirect";
import RutinasPage from "./pages/RutinasPage";
import EjerciciosPage from "./pages/EjerciciosPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { TabBar } from "./components/TabBar";
import ImportarRutinasPage from "./pages/ImportarRutinasPage";
import EntrenamientoPage from "./pages/EntrenamientoPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TabBar></TabBar>
        <div className="p-4 flex h-full items-center justify-center">
            <Routes>
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/login" element={<AuthRedirect />} />
                <Route path="/ejercicios" element={
                  <ProtectedRoute>
                    <EjerciciosPage />
                  </ProtectedRoute>}/>
                <Route path="/rutinas" element={
                  <ProtectedRoute>
                    <RutinasPage />
                  </ProtectedRoute>}/>
                <Route path="/importar-rutinas" element={
                  <ProtectedRoute roleRequired="Admin">
                    <ImportarRutinasPage />
                  </ProtectedRoute>}/>
                <Route path="/entrenamiento" element={
                  <ProtectedRoute>
                    <EntrenamientoPage />
                  </ProtectedRoute>}/>
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
    

