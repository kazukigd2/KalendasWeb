// ======================================================================
// ========================== IMPORTS ====================================
// ======================================================================

import "../../estilos/Calendario/CalendarioPrincipal.css";
import { NavLink } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

import esLocale from "@fullcalendar/core/locales/es";
import { useEffect, useMemo, useState } from "react";

import { EventClickArg } from "@fullcalendar/core";
import EventoCalendario from "./EventoCalendario";
import { PopupEvento } from "../PopUp/EventoPopUpMostrar";

import {
  CalendarioDTO,
  EventoDTO,
  EventoRespuesta
} from "../../schemas/KalendasSchemas";

import { obtenerEventoPorId } from "../../services/KalendasService";
import { useUsuario } from "../../contextos/UsuarioContext";

import PreviewEventoPopUp from "../PopUp/PreviewEventoPopUp";
import Boton from "../Boton";
import ConfirmacionPopUp from "../PopUp/ConfirmacionPopUp";

// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================

interface Props {
  etiquetasVisibles: Record<string, boolean>;
  visibles: Record<string, boolean>;
  calendarioActual: CalendarioDTO | null;
  eventosCalendario: EventoRespuesta[];
  cantidadCalendarios: number;

  eventoSeleccionado: EventoDTO | null;
  setEventoSeleccionado: (e: EventoDTO | null) => void;

  onEliminarEvento: (eventoId: string) => void;
  onEditarEvento: (ev: EventoDTO) => void;
  onSeleccionarFecha: (fechaIso: string) => void;
}

// ======================================================================
// ========================== COMPONENTE =================================
// ======================================================================

export default function CalendarioPrincipal({
  calendarioActual,
  cantidadCalendarios,
  etiquetasVisibles,
  visibles,
  eventosCalendario,
  eventoSeleccionado,
  setEventoSeleccionado,
  onEliminarEvento,
  onEditarEvento,
  onSeleccionarFecha,
}: Props) {

  // ======================================================================
  // ========== STATES ====================================================
  // ======================================================================

  const {
    calendariosSuscritos,
    usuario,
    suscribirseGlobal,
    desuscribirseGlobal
  } = useUsuario();

  const [popupMensaje, setPopupMensaje] = useState<string | null>(null);
  const [popupConfirmarDesuscribir, setPopupConfirmarDesuscribir] = useState(false);

  const [hoverEvento, setHoverEvento] = useState<any | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const idUrl = window.location.pathname.split("/").pop();
  const esPublico = calendarioActual?.publico === true;
  const esPropio = calendarioActual?.usuarioId === usuario?._id;
  const estaSuscrito = calendariosSuscritos.some(c => c._id === idUrl);
  const disabledBoton = esPropio || !esPublico;

  const [busquedaEventos, setBusquedaEventos] = useState("");

  const esVistaIndividual = cantidadCalendarios === 1;
  const breadcrumbTitulo = esVistaIndividual
    ? calendarioActual?.titulo || "Calendario"
    : "Mis calendarios";

  // ======================================================================
  // ========== FILTRADO ==================================================
  // ======================================================================

const normalizar = (txt: string) =>
  txt.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const eventosFiltrados = useMemo(() => {
  const filtro = normalizar(busquedaEventos);

  return eventosCalendario.filter((ev) => {

    // 1) FILTRO POR CALENDARIO
    if (!visibles[ev.calendarioId]) return false;

    // 2) FILTRO POR ETIQUETA
    const etiquetaId = ev.etiqueta?.etiquetaId;
    if (etiquetaId && etiquetasVisibles[etiquetaId] === false) return false;

    // 3) FILTRO POR BÚSQUEDA
    if (busquedaEventos.trim() !== "") {
      const titulo = normalizar(ev.titulo || "");
      const descripcion = normalizar(ev.descripcion || "");
      const lugar = normalizar(ev.lugar || "");

      const coincide =
        titulo.includes(filtro) ||
        descripcion.includes(filtro) ||
        lugar.includes(filtro);

      if (!coincide) return false;
    }

    return true;
  });
}, [eventosCalendario, visibles, etiquetasVisibles, busquedaEventos]);

  // ======================================================================
  // ========== MAPEO (OPTIMIZADO, SIN PARPADEO) ==========================
  // ======================================================================

  const eventosFullCalendar = useMemo(() => {
    return eventosFiltrados.map((e) => ({
      id: e._id,
      title: e.titulo,
      start: e.fechaComienzo,
      end: e.fechaFinal,

      // Props visuales (no causan conflictos)
      backgroundColor: e.etiqueta?.color || "white",
      borderColor: e.etiqueta?.color || "white",

      // Props personalizadas
      descripcion: e.descripcion,
      lugar: e.lugar,
      etiqueta: e.etiqueta,
    }));
  }, [eventosFiltrados]);

  // ======================================================================
  // ========== FULLCALENDAR EVENTOS =====================================
  // ======================================================================

  const handleDateClick = (arg: DateClickArg) => {
    onSeleccionarFecha(arg.dateStr);
  };

  const handleEventClick = async (arg: EventClickArg) => {
    try {
      const eventoCompleto = await obtenerEventoPorId(arg.event.id);
      setEventoSeleccionado(eventoCompleto);
    } catch (error) {
      console.error(error);
      alert("Error al cargar evento.");
    }
  };

  const seguirRaton = (e: MouseEvent) => {
    setHoverPos({ x: e.clientX + 12, y: e.clientY + 12 });
  };

  const handleEventMouseEnter = (info: any) => {
    const ev = info.event;

    setHoverEvento({
      titulo: ev.title,
      descripcion: ev.extendedProps.descripcion,
      lugar: ev.extendedProps.lugar,
      etiqueta: ev.extendedProps.etiqueta,
    });

    document.addEventListener("mousemove", seguirRaton);
  };

  const handleEventMouseLeave = () => {
    setHoverEvento(null);
    document.removeEventListener("mousemove", seguirRaton);
  };

  // ======================================================================
  // ========== SUSCRIPCIÓN ==============================================
  // ======================================================================

  const handleClickSuscripcion = async () => {
    if (!calendarioActual?._id || disabledBoton) return;

    if (estaSuscrito) {
      setPopupConfirmarDesuscribir(true);
    } else {
      const ok = await suscribirseGlobal(calendarioActual._id);
      if (ok) setPopupMensaje(`Te has suscrito al calendario "${calendarioActual.titulo}"`);
    }
  };

  // ======================================================================
  // ===================== RENDER ==========================================
  // ======================================================================

  return (
    <div className="divCalendario">

      {/* BREADCRUMB + SUSCRIPCIÓN */}
      <div className="breadcrumb">
        <NavLink to="/home" className="crumb link">
          Home
        </NavLink>
        <span className="separator"> &gt; </span>
        <span className="crumb active">{breadcrumbTitulo}</span>

        {/* BUSCADOR DE EVENTOS */}
        <input
          type="text"
          placeholder="Buscar eventos..."
          className="inputBuscarEventos"
          value={busquedaEventos}
          onChange={(e) => setBusquedaEventos(e.target.value)}
        />

        {/* BOTÓN SUSCRIBIR */}
        {calendarioActual && esPublico && (
          <Boton
            tipo="mini"
            disabled={disabledBoton}
            onClick={handleClickSuscripcion}
            className={`BotonSuscribirseNuevo ${
              esPropio
                ? "boton-propio"
                : estaSuscrito
                ? "boton-desuscribirse"
                : "boton-suscribirse"
            }`}
          >
            {esPropio
              ? "Propio"
              : estaSuscrito
              ? "Desuscribirse"
              : "Suscribirse"}
          </Boton>
        )}
      </div>

      {/* CALENDARIO */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        locale={esLocale}
        height={525}
        initialView="dayGridMonth"
        events={eventosFullCalendar}   // ✔ optimizado
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        eventDisplay="block"
        eventContent={EventoCalendario}
        selectable={true}
        dateClick={handleDateClick}
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      />

      {/* POPUP EVENTO */}
      {eventoSeleccionado && (
        <PopupEvento
          ev={eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
          onSolicitarEliminar={onEliminarEvento}
          onSolicitarEditar={onEditarEvento}
        />
      )}

      {/* POPUP PREVIEW */}
      <PreviewEventoPopUp hoverEvento={hoverEvento} hoverPos={hoverPos} />

      {/* POPUP MENSAJE */}
      {popupMensaje && (
        <ConfirmacionPopUp
          mensaje={popupMensaje}
          textoAceptar="Aceptar"
          textoCancelar=""
          onAceptar={() => setPopupMensaje(null)}
        />
      )}

      {/* POPUP DESUSCRIBIR */}
      {popupConfirmarDesuscribir && (
        <ConfirmacionPopUp
          mensaje={`¿Desuscribirte de "${calendarioActual?.titulo}"?`}
          textoAceptar="Desuscribirse"
          textoCancelar="Cancelar"
          onAceptar={async () => {
            await desuscribirseGlobal(calendarioActual!._id);
            setPopupConfirmarDesuscribir(false);
          }}
          onCancelar={() => setPopupConfirmarDesuscribir(false)}
        />
      )}

    </div>
  );
}
