import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthRedirect from "./components/Auth/AuthRedirect";
import RutinasPage from "./pages/RutinasPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { TabBar } from "./components/TabBar";
import ImportarRutinasPage from "./pages/ImportarRutinasPage";
import EntrenamientoPage from "./pages/EntrenamientoPage";
import RegistroPage from "./pages/RegistroPage";

const EstadisticasPage = lazy(() => import("./pages/EstadisticasPage"));
const EjerciciosPage = lazy(() => import("./pages/EjerciciosPage"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TabBar></TabBar>
        <div className="p-4 flex h-full items-center justify-center">
            <Routes>
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/login" element={<AuthRedirect />} />
                <Route path="/register" element={<RegistroPage />} />
                <Route path="/ejercicios" element={
                  <ProtectedRoute>
                    <Suspense fallback={<p className="training-card-muted">Cargando ejercicios...</p>}>
                      <EjerciciosPage />
                    </Suspense>
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
                <Route path="/estadisticas" element={
                  <ProtectedRoute>
                    <Suspense fallback={<p className="training-card-muted">Cargando estadísticas...</p>}>
                      <EstadisticasPage />
                    </Suspense>
                  </ProtectedRoute>}/>
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
    

