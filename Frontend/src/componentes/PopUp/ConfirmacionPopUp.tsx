// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
import React from "react";
import "../../estilos/PopUp/PopupConfirmacion.css";
import Boton from "../Boton";

// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface Props {
    mensaje: string;
    onAceptar: () => void;
    // Hacemos onCancelar opcional porque en modo "Alerta" no se usa
    onCancelar?: () => void; 
    textoAceptar?: string;
    // Permitimos string vacío o null para ocultar el botón
    textoCancelar?: string; 
    error?: boolean;
}

// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const ConfirmacionPopUp: React.FC<Props> = ({ 
    mensaje, 
    onAceptar, 
    onCancelar, 
    textoAceptar = "Aceptar", 
    textoCancelar = "Cancelar", // Valor por defecto (para que funcione en el borrado normal)
    error = false
}) => {
    return (
        <div className="popup-overlay">
            <div className="popup-card popup-anim">
                <h3 className="popup-title" style={error ? { color: "red" } : {}}>
                    {error ? "Error" : "Confirmación"}
                </h3>
                <p className="popup-message">{mensaje}</p>

                <div className="popup-buttons">
                    {/* Solo mostrar cancelar si hay texto */}
                    {textoCancelar && (
                        <Boton tipo="mini-rojo" onClick={onCancelar || onAceptar}>
                            {textoCancelar}
                        </Boton>
                    )}

                    <Boton tipo="mini" onClick={onAceptar}>
                        {textoAceptar}
                    </Boton>
                </div>
            </div>
        </div>
    );
};
export default ConfirmacionPopUp;