// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

//Imports propios
import Home from "./paginas/Principal";
import Login from "./paginas/InicioSesion";
import EditarCuenta from "./paginas/EditarCuenta";
import Calendario from "./paginas/CalendarioPagina";
import TopBar from "./componentes/TopBar";
import CalendariosPublicos from "./paginas/CalendariosPublicos";


// ======================================================================
// ========================= Funciones Globales =========================
// ======================================================================
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const logueado = localStorage.getItem("logueado") === "true";

    return logueado ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
    const location = useLocation();

    // if de toda la vida
    const mostrarTopBar =
        location.pathname !== "/login";

    return (
        <>
            {mostrarTopBar && (
                    <TopBar />
            )}
            <div
                style={{
                    paddingTop: mostrarTopBar ? "4rem" : "0",  // altura real de la topbar
                }}
            >
            {/* Si hay topbar, hago espacio arriba */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/editar-cuenta" element={<PrivateRoute><EditarCuenta /></PrivateRoute>} />
                    <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
                    <Route path="/calendario/:id" element={<PrivateRoute><Calendario /></PrivateRoute>}/>
                    <Route path="/buscar-calendarios" element={<PrivateRoute><CalendariosPublicos /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                </div>
        </>
    );
};



// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
