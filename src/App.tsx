import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { UsuariosPage } from "./pages/UsuariosPage";

function ProtectedRoute() {
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setRehidratado(true);
    });
    return unsubscribe;
  }, []);

  if (!rehidratado) return null;

  return autenticado && token ? (
    <DashboardPage />
  ) : (
    <Navigate to="/login" replace />
  );
}

function AdminRoute() {
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
  const esAdmin = useAuthStore((state) => state.esAdmin);
  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setRehidratado(true);
    });
    return unsubscribe;
  }, []);

  if (!rehidratado) return null;

  if (!autenticado || !token) return <Navigate to="/login" replace />;
  if (!esAdmin()) return <Navigate to="/dashboard" replace />;

  return <UsuariosPage />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute />} />
      <Route path="/usuarios" element={<AdminRoute />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
