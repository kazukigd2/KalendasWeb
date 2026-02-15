// ======================================================================
// ========================== IMPORTS ===================================
// ======================================================================
// Imports básicos
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Login.css";

// Imports propios
import Boton from "../componentes/Boton";
import { useUsuario } from "../contextos/UsuarioContext";
import { listarCalendariosPropios, listarNotificaciones, listarCalendariosSuscritos } from "../services/KalendasService";
import Autenticacion from "../componentes/Externos/ControlAcceso";
import { useAuth } from "../contextos/AuthContext"; // 2. Importar Auth



// ======================================================================
// ============================ COMPONENTE ===============================
// ======================================================================
const Login: React.FC = () => {


// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================
    const [usuarioTextBox, setUsuarioTextBox] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { usuario, usuarioLoading, actualizarUsuario, setCalendarios, setNotificaciones, setCalendariosSuscritos } = useUsuario();
    const { user } = useAuth();



// ======================================================================
// ========================== Funciones  ================================
// ======================================================================

    useEffect(() => {
  // navegar solo cuando firebase user existe y la sincronización usuarioMongo ya terminó
  if (user && !usuarioLoading && usuario) {
    console.log("Navegando a /home después de login exitoso");
    navigate("/home");
  }
}, [user, usuario, usuarioLoading]);
// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
return (
  <div className="login-page">

    {/* Panel Izquierdo con Imagen */}
    <div className="login-left">
      <div className="login-left-overlay">
        <h1 className="login-title">Kalendas</h1>
        <p className="login-subtitle">
          Organiza tu tiempo, conecta con tus eventos y mantén tu vida en orden.
        </p>
      </div>
    </div>

    {/* Panel Derecho: Formulario */}
    <div className="login-right">

      <div className="login-card">

        {/* ======================= FORMULARIO ======================= */}
        <form
        className="login-form"
        onSubmit={(e) => {
            e.preventDefault();
            //handleLogin();
        }}
        >
          {/*Autenticación*/}
          <Autenticacion></Autenticacion>
          {/* Error */}
          {error && <p className="login-error">{error}</p>}
        </form>
        {/* =========================================================== */}

      </div>

    </div>

  </div>
);
};

export default Login;
