// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================

//Imports Basicos

//Imports de FullCalendar
import { EventContentArg } from "@fullcalendar/core";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================



// ======================================================================
// ========================= Funciones Globales =========================
// ======================================================================



// ======================================================================
// ============================COMPONENTE ===============================
// ======================================================================
export default function EventoCalendario(eventInfo: EventContentArg) {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================
    const props = eventInfo.event.extendedProps as {
        descripcion: string;
        lugar: string;
        etiqueta: { color: string } | null;
    };

    const color =
        props.etiqueta?.color ||
        eventInfo.event.backgroundColor ||
        "#ffffff"; // fallback
// ======================================================================
// ========================== Funciones  ================================
// ======================================================================



// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
    return (
        <div className="VisualizadorEvento"
        style={{
            backgroundColor: color,
            border: `2px solid ${color}`,
            borderRadius: "4px",
            padding: "2px 4px",
            color: "white",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.8rem"
        }}
        >
            <div className="TituloEvento">{eventInfo.event.title}</div>
        </div>
    );
}
