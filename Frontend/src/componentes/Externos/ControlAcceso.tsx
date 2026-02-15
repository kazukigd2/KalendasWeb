// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
import React from "react";
import { useAuth } from "../../contextos/AuthContext"; 
import Boton from "../Boton"; 

// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const ControlAcceso: React.FC = () => {
    
    // Extraemos las funciones y variables SIN renombrar (mapear)
    const { 
        user, 
        loading, 
        signInWithGoogle, 
        signInWithGithub, 
        logOut 
    } = useAuth();

    // 1. Estado de carga
    if (loading) {
        return <div className="control-acceso-loading">Cargando información...</div>;
    }

    // 2. Estado: Usuario NO logueado
    return (
        <div className="control-acceso-container">
            <h2 className="control-acceso-titulo">Iniciar Sesión</h2>
            <p className="control-acceso-texto">
                Necesitas identificarte para ver y gestionar tus calendarios.
            </p>
            
            <div className="control-acceso-botones">
                {/* Botón Google */}
                <Boton 
                    onClick={signInWithGoogle} 
                    tipo="primario"
                    className="btn-google"
                >
                    Entrar con Google
                </Boton>

                {/* Botón GitHub */}
                <Boton 
                    onClick={signInWithGithub} 
                    tipo="primario" 
                    className="btn-github"
                >
                    Entrar con GitHub
                </Boton>
            </div>
        </div>
    );
};

export default ControlAcceso;