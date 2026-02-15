// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React from "react";
import "../../estilos/Notificaciones/Notificacion.css";

//Imports propios
import Boton from "../Boton";
import { NotificacionRespuesta } from "../../schemas/KalendasSchemas";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface Props {
    noti: NotificacionRespuesta & { removing?: boolean };
    onLeer: () => void;
    onEliminar: () => void;
}


// ======================================================================
// ========================= Funciones Globales =========================
// ======================================================================



// ======================================================================
// ============================COMPONENTE ===============================
// ======================================================================
const Notificacion: React.FC<Props> = ({ noti, onLeer, onEliminar }) => {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================



// ======================================================================
// ========================== Funciones  ================================
// ======================================================================



// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
    return (
        <div
            className={`noti-container 
                ${noti.leido ? "leida" : "no-leida"} 
                ${noti.removing ? "removing" : ""}`}
            onClick={onLeer}
        >
            <div className="noti-content">
                <strong className="noti-evento">{noti.evento}</strong>
                <p className="noti-comentario">{noti.comentario}</p>
                <span className="noti-autor">– {noti.comentarioUsuario}</span>
            </div>

            {/* Botón borrar solo si está leída */}
            {noti.leido && !noti.removing && (
                <div className="noti-actions" onClick={(e) => e.stopPropagation()}>
                    <Boton tipo="mini-rojo" onClick={onEliminar}>
                        Borrar
                    </Boton>
                </div>
            )}
        </div>
    );
};

export default Notificacion;
