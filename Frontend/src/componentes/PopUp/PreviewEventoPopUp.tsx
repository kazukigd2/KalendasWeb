// ======================================================================
// ======================= IMPORTS & TYPES ==============================
// ======================================================================

// Import propios
import "../../estilos/PopUp/PreviewEventoPopUp.css";
import { createPortal } from "react-dom";


// ======================================================================
// ======================= VARIABLES DE ENTRADA =========================
// ======================================================================

interface PreviewEventoPopUpProps {
  hoverEvento: {
    titulo: string;
    descripcion?: string;
    lugar?: string;
    etiqueta?: { etiqueta: string; color: string };
  } | null;

  hoverPos: { x: number; y: number };
}

// ======================================================================
// =========================== COMPONENTE ================================
// ======================================================================

export default function PreviewEventoPopUp({ hoverEvento, hoverPos }: PreviewEventoPopUpProps) {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================


  if (!hoverEvento) return null;

  const descripcion = hoverEvento.descripcion?.trim() || "Sin descripción";
  const lugar = hoverEvento.lugar?.trim() || "Sin ubicación";

// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================

  return createPortal(
    <div
      className="preview-hover-evento"
      style={{
        position: "fixed",   // 👈 Esto es LO MÁS IMPORTANTE
        top: hoverPos.y + 8, // pegado al cursor
        left: hoverPos.x + 8,
        pointerEvents: "none", // evita problemas
        zIndex: 9999
      }}
    >
      <h4 className="preview-hover-titulo">{hoverEvento.titulo}</h4>

      <p
        className={
          "preview-hover-descripcion " +
          (!hoverEvento.descripcion ? "vacia" : "")
        }
      >
        {descripcion}
      </p>

      <p
        className={
          "preview-hover-lugar " +
          (!hoverEvento.lugar ? "vacia" : "")
        }
      >
        📍 {lugar}
      </p>

      {hoverEvento.etiqueta && (
        <span
          className="preview-hover-etiqueta"
          style={{ background: hoverEvento.etiqueta.color }}
        >
          {hoverEvento.etiqueta.etiqueta}
        </span>
      )}
    </div>,
     document.body
  );
 
}