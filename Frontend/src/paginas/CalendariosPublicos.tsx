// ======================================================================
// ========================== IMPORTS ===================================
// ======================================================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/paginas/CalendariosPublicos.css"; 

// Imports propios
import Boton from "../componentes/Boton";
import { CalendarioDTO } from "../schemas/KalendasSchemas";
import { listarCalendariosPublicos } from "../services/KalendasService";
import { useUsuario } from "../contextos/UsuarioContext";
import ConfirmacionPopUp from "../componentes/PopUp/ConfirmacionPopUp";
import lupaIcono from "../imagenes/IconoLupa.svg";
import imagenBaseCalendario from "../imagenes/imagenBaseCalendario.png";



// ======================================================================
// ============================ COMPONENTE ===============================
// ======================================================================
const CalendariosPublicos: React.FC = () => {

  // ======================================================================
  // ========== Variables de Estado del componente ========================
  // ======================================================================
  const navigate = useNavigate();
  const { calendarios: misCalendarios } = useUsuario();
  const { calendariosSuscritos,
    suscribirseGlobal,
    desuscribirseGlobal } = useUsuario();

  const portadaBase = "/img/default-portada.png";
  const [calendariosPublicos, setCalendariosPublicos] = useState<CalendarioDTO[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // Popup mensaje simple (suscribirse)
  const [popupMensaje, setPopupMensaje] = useState<string | null>(null);

  // Popup confirmar desuscripción
  const [popupConfirmarDesuscribir, setPopupConfirmarDesuscribir] = useState(false);
  const [calendarioADesuscribir, setCalendarioADesuscribir] = useState<CalendarioDTO | null>(null);

  // ======================================================================
  // ========================== Funciones  ================================
  // ======================================================================

  const estaSuscrito = (calId: string): boolean => {
      return calendariosSuscritos.some(c => c._id === calId);
  };
  
  // ======================================================================
  // ===================== Inicialización / Efectos ========================
  // ======================================================================


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const datos = await listarCalendariosPublicos();
        setCalendariosPublicos(datos);
      } catch (error) {
        console.error("Error al cargar calendarios públicos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);
  
  // ======================================================================
  // ================= SUSCRIBIRSE / DESUSCRIBIRSE ========================
  // ======================================================================

  const handleToggleSuscripcion = async (cal: CalendarioDTO) => {
    if (estaSuscrito(cal._id)) {
      // ABRIR POPUP DE CONFIRMACIÓN
      setCalendarioADesuscribir(cal);
      setPopupConfirmarDesuscribir(true);
    } 
    else {
      // SUSCRIBIRSE DIRECTAMENTE
      const ok = await suscribirseGlobal(cal._id);

      if (ok) {
        setPopupMensaje(`Te has suscrito al calendario "${cal.titulo}"`);
      }
    }
  };

  const confirmarDesuscribir = async () => {
    if (!calendarioADesuscribir) return;

    await desuscribirseGlobal(calendarioADesuscribir._id);

    // CERRAR POPUP únicamente
    setPopupConfirmarDesuscribir(false);
    setCalendarioADesuscribir(null);
  };


  const esPropio = (idPublico: string): boolean => {
      const buscarEnLista = (lista: CalendarioDTO[]): boolean => {
          return lista.some(c => {
              if (c._id === idPublico) return true;
              // Casting doble para evitar error de tipos incompatibles
              if (c.subcalendarios && c.subcalendarios.length > 0) {
                  return buscarEnLista(c.subcalendarios as unknown as CalendarioDTO[]);
              }
              return false;
          });
      };
      return buscarEnLista(misCalendarios);
  };

  const normalizar = (txt: string) => 
    txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const calendariosFiltrados = calendariosPublicos.filter((cal) => 
    normalizar(cal.titulo).includes(normalizar(busqueda)) || 
    (cal.descripcion && normalizar(cal.descripcion).includes(normalizar(busqueda)))
  );

  

  // ======================================================================
  // ===================== Return (HTML de respuesta) =====================
  // ======================================================================

return (
  <div className="publicos-container">

  {/* ==================== CABECERA (ESTILO HOME) ==================== */}
  <div className="publicos-header-bg">
    <div className="publicos-header-content">
      <h1 className="publicos-title">Explorar calendarios públicos</h1>
      <p className="publicos-subtitle">
        Descubre nuevos calendarios, suscríbete con un clic y mantente al día.
      </p>

      {/* BUSCADOR */}
      <div className="publicos-search-wrapper">
        <img src={lupaIcono} alt="Buscar" className="publicos-search-icon" />
        <input
          type="text"
          className="publicos-search-input"
          placeholder="Buscar calendarios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
    </div>
  </div>

    {/* ==================== RESULTADOS ==================== */}
    {cargando ? (
      <p className="publicos-loading">Cargando calendarios...</p>
    ) : (
      <div className="publicos-grid">

        {calendariosFiltrados.length === 0 && (
          <p className="publicos-empty">No se encontraron calendarios.</p>
        )}

        {calendariosFiltrados.map((cal) => {
          const soyDuenio = esPropio(cal._id);

          return (
            <div
              key={cal._id}
              className="publicos-card"
              onClick={() => navigate(`/calendario/${cal._id}`)}
            >

              {/* IMAGEN */}
              <div className="publicos-img-wrapper">
                <img
                  src={cal.portada || imagenBaseCalendario}
                  alt={cal.titulo}
                  className="publicos-img"
                />
                <span className="publicos-badge">Público</span>
              </div>

              {/* INFO */}
              <div className="publicos-info">
                <h3 className="publicos-card-title">{cal.titulo}</h3>

                {cal.descripcion && (
                  <p className="publicos-card-desc">{cal.descripcion}</p>
                )}

              <div className="publicos-card-btn">
                {soyDuenio ? (
                  <button className="publicos-own-btn" disabled>
                    Propio
                  </button>
                ) : estaSuscrito(cal._id) ? (
                  <button
                    className="publicos-unsubscribe-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSuscripcion(cal);
                    }}
                  >
                    Desuscribirse
                  </button>
                ) : (
                  <Boton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSuscripcion(cal);
                    }}
                  >
                    Suscribirse
                  </Boton>
                )}
              </div>

              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* POPUPS */}
    {popupMensaje && (
      <ConfirmacionPopUp
        mensaje={popupMensaje}
        textoAceptar="Aceptar"
        textoCancelar=""
        onAceptar={() => setPopupMensaje(null)}
      />
    )}

    {popupConfirmarDesuscribir && calendarioADesuscribir && (
      <ConfirmacionPopUp
        mensaje={`¿Desuscribirte de "${calendarioADesuscribir.titulo}"?`}
        textoAceptar="Desuscribirse"
        textoCancelar="Cancelar"
        onAceptar={confirmarDesuscribir}
        onCancelar={() => {
          setPopupConfirmarDesuscribir(false);
          setCalendarioADesuscribir(null);
        }}
      />
    )}

  </div>
);
};
export default CalendariosPublicos;