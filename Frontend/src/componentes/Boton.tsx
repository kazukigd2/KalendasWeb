// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React from "react";
import "../estilos/Boton.css";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface BotonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
    disabled?: boolean;
    type?: "button" | "submit";
    tipo?: "primario" | "menu" | "icono" | "icono-notif" | "mini" | "mini-rojo";
    count?: number; // badge para notificaciones
    className?: string;
    hidden?: boolean;
}


// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const Boton: React.FC<BotonProps> = ({
    children,
    onClick,
    disabled = false,
    type = "button",
    tipo = "primario",
    count,
    className = "",
    hidden = false,
}) => {

// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
    return (
        <button
            className={`boton boton-${tipo} ${disabled ? "boton-disabled" : ""} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            hidden={hidden}
        >
            {children}

            {/* Badge rojo para icono-notif */}
            {tipo === "icono-notif" && count !== undefined && count > 0 && (
                <span className="boton-badge">{count}</span>
            )}
        </button>
    );
};

export default Boton;
