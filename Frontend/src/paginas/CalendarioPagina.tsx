// ======================================================================
// ========================== IMPORTS ===================================
// ======================================================================

import React, { useState, useEffect } from "react";
import "../estilos/Calendario/CalendarioPagina.css";
import { useParams } from "react-router-dom";

// Componentes propios
import BarraLateralCalendario from "../componentes/Calendario/BarraLateralCalendario";
import CalendarioPrincipal from "../componentes/Calendario/CalendarioPrincipal";
import PopupCalendarioUnificado from "../componentes/PopUp/CalendarioPopUpCrearEditar";
import EventoPopUpCrearEditar from "../componentes/PopUp/EventoPopUpCrearEditar";
import ConfirmacionPopUp from "../componentes/PopUp/ConfirmacionPopUp";

import { useUsuario } from "../contextos/UsuarioContext";
import {
  CalendarioDTO,
  CalendarioCrear,
  CalendarioModificar,
  EventoDTO,
  EventoModificar,
  EventoCrear,
  EtiquetaDTO
} from "../schemas/KalendasSchemas";

import {
  eliminarEvento,
  editarEvento,
  crearEvento,
  listarEtiquetas,
  obtenerCalendarioPorId,
} from "../services/KalendasService";

// ======================================================================
// ============================ COMPONENTE ===============================
// ======================================================================

export default function CalendarioPagina() {
  const {
    calendarios,
    calendariosSuscritos,
    crearCalendarioGlobal,
    editarCalendarioGlobal,
    recargarCalendarios,
    usuario,
  } = useUsuario();

  // ======================================================================
  // ========== Variables de Estado del componente ========================
  // ======================================================================

  const { id } = useParams<{ id?: string}>();
  let idsFiltrar: string[] | null = null;

  const [calendarioCargado, setCalendarioCargado] = useState<CalendarioDTO | null>(null);

  const calendariosDefinitivos = React.useMemo(() => {
    // 1) Si NO hay ID → mostrar todos los calendarios del usuario (vista general)
    if (!id) {
      return [...calendarios, ...calendariosSuscritos];
    }

    // 2) Si hay ID → mostrar solo el calendario cargado desde el backend
    if (calendarioCargado) {
      return [calendarioCargado];
    }

    // 3) Mientras se carga → devolver array vacío (evita errores)
    return [];
  }, [id, calendarios, calendariosSuscritos, calendarioCargado]);

  const [visibles, setVisibles] = useState<Record<string, boolean>>({});
  const [etiquetasVisibles, setEtiquetasVisibles] = useState<Record<string, boolean>>({});
  
  // Etiquetas presentes en los eventos (para filtro lateral)
  const etiquetasUnicas = extraerEtiquetasUnicas(calendariosDefinitivos);
  const eventosCompletos = extraerEventos(calendariosDefinitivos);

  // Etiquetas completas de la BBDD (para crear eventos)
  const [todasLasEtiquetas, setTodasLasEtiquetas] = useState<EtiquetaDTO[]>([]);

  // ---- Popup Calendario (Gestión de calendarios) ----
  const [mostrarPopupCalendario, setMostrarPopupCalendario] = useState(false);
  const [popupModoCalendario, setPopupModoCalendario] = useState<"crear" | "editar">("crear");
  const [calendarioAEditar, setCalendarioAEditar] = useState<CalendarioDTO | null>(null);

  // ---- Popup Evento UNIFICADO (Gestión de eventos) ----
  const [mostrarPopupEvento, setMostrarPopupEvento] = useState(false);
  const [modoEvento, setModoEvento] = useState<"crear" | "editar">("crear");
  
  const [eventoParaEditar, setEventoParaEditar] = useState<EventoDTO | null>(null);
  const [fechaParaCrear, setFechaParaCrear] = useState<string>("");

  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoDTO | null>(null);

  const [popupConfirmarEliminar, setPopupConfirmarEliminar] = useState(false);
  const [eventoIdAEliminar, setEventoIdAEliminar] = useState<string | null>(null);

  const cerrarPopupEventoDetalle = () => setEventoSeleccionado(null);

  // ======================================================================
  // ========================== Funciones  ================================
  // ======================================================================

  function extraerEtiquetasUnicas(cals: CalendarioDTO[]) {
    const mapa: Record<string, any> = {};

    const recorrer = (cal: any) => {
      if (!cal) return;

      // Etiquetas de eventos del calendario
      cal.eventos?.forEach((ev: any) => {
        if (ev.etiqueta?.etiquetaId) {
          mapa[ev.etiqueta.etiquetaId] = ev.etiqueta; // ← evita duplicados
        }
      });

      // Recorrer subcalendarios
      if (Array.isArray(cal.subcalendarios)) {
        cal.subcalendarios.forEach((sub: any) => recorrer(sub));
      }
    };

    cals.forEach(recorrer);

    return Object.values(mapa); // ← devuelve etiquetas únicas únicamente
  }

  function extraerEventos(cals: CalendarioDTO[]) {
    const eventos: any[] = [];
    const recorrer = (cal: any) => {
      cal.eventos?.forEach((ev: any) =>
        eventos.push({ ...ev, calendarioId: cal._id })
      );
      cal.subcalendarios?.forEach((sub: any) => recorrer(sub));
    };
    cals.forEach((c) => recorrer(c));
    return eventos;
  }


  // ======================================================================
  // ========================= EVENTOS ===================================
  // ======================================================================

  const solicitarEliminarEvento = (eventoId: string) => {
    setEventoIdAEliminar(eventoId);
    setPopupConfirmarEliminar(true);
  };

  const handleEliminarEvento = async () => {
    if (!eventoIdAEliminar) return;

    const ok = await eliminarEvento(eventoIdAEliminar);
    if (!ok) {
      alert("Error al eliminar evento");
      return;
    }

    await recargarCalendarios();
    if(id){
      const cale = await obtenerCalendarioPorId(id);
      setCalendarioCargado(cale);
    }
    cerrarPopupEventoDetalle();
    setPopupConfirmarEliminar(false);
    setEventoIdAEliminar(null);
  };

  const handleEditarEvento = (ev: EventoDTO) => {
    setModoEvento("editar");
    setEventoParaEditar(ev);
    setFechaParaCrear(""); 
    setMostrarPopupEvento(true);
  };

  const handleSeleccionarFecha = (fecha: string) => {
    if(id && usuario?._id === calendarioCargado?.usuarioId){
      setModoEvento("crear");
      setFechaParaCrear(fecha);
      setEventoParaEditar(null); 
      setMostrarPopupEvento(true);
    } else if (!id){
      setModoEvento("crear");
      setFechaParaCrear(fecha);
      setEventoParaEditar(null); 
      setMostrarPopupEvento(true);
    }

  };

  const cerrarPopupUnificado = () => {
    setMostrarPopupEvento(false);
    setEventoParaEditar(null);
    setFechaParaCrear("");
  };

  const handleGuardarEventoEditado = async (eventoId: string, datos: EventoModificar) => {
    const ok = await editarEvento(eventoId, datos);
    if (!ok) {
      alert("Error al editar evento");
      return;
    }
    await recargarCalendarios();
    if(id){
      const cale = await obtenerCalendarioPorId(id);
      setCalendarioCargado(cale);
    }
    cerrarPopupUnificado();
    setEventoSeleccionado(null); 
  };

  const handleGuardarEventoNuevo = async (datos: EventoCrear) => {
    const ok = await crearEvento(datos);
    if (!ok) {
      alert("Error al crear evento");
      return;
    }
    await recargarCalendarios();
    if(id){
      const cale = await obtenerCalendarioPorId(id);
      setCalendarioCargado(cale);
    }
    cerrarPopupUnificado();
  };

  // ======================================================================
  // ===================== CALENDARIOS (CREAR/EDITAR) =====================
  // ======================================================================

  const abrirCrearCalendario = () => {
    setPopupModoCalendario("crear");
    setCalendarioAEditar(null);
    setMostrarPopupCalendario(true);
  };


  const abrirEditarCalendario = (cal: CalendarioDTO) => {
    setPopupModoCalendario("editar");
    setCalendarioAEditar(cal);
    setMostrarPopupCalendario(true);
  };
  // ---------------------------------------------------

  const handleCrearCalendario = async (datos: CalendarioCrear) => {
    await crearCalendarioGlobal(datos);
    
    if(id){
      const cale = await obtenerCalendarioPorId(id);
      setCalendarioCargado(cale);
    }

    setMostrarPopupCalendario(false);
  };

  const handleEditarCalendario = async (datos: CalendarioModificar) => {
    if (!calendarioAEditar) return;
    await editarCalendarioGlobal(calendarioAEditar._id, datos);
    
    if(id){
      const cale = await obtenerCalendarioPorId(id);
      setCalendarioCargado(cale);
    }

    setMostrarPopupCalendario(false);
    setCalendarioAEditar(null);
  };

  

  // ======================================================================
  // ===================== Inicialización / Efectos ========================
  // ======================================================================

  useEffect(() => {
    const cargarEtiquetasBBDD = async () => {
      try {
        const data = await listarEtiquetas();
        setTodasLasEtiquetas(data);
      } catch (error) {
        console.error("Error cargando etiquetas:", error);
      }
    };
    cargarEtiquetasBBDD();
  }, []); 

  useEffect(() => {
    // Si no hay calendarios todavía, no hacemos nada
    if (!calendariosDefinitivos || calendariosDefinitivos.length === 0) return;

    const nuevos: Record<string, boolean> = {};

    // función recursiva defensiva: acepta cualquier forma de calendario/respuesta
    const recorrer = (cal: any) => {
      if (!cal) return;
      // si tiene _id lo marcamos visible
      if (cal._id) nuevos[cal._id] = true;

      // si tiene subcalendarios (array) los recorremos también
      const subs = Array.isArray(cal.subcalendarios) ? cal.subcalendarios : [];
      subs.forEach((sub: any) => recorrer(sub));
    };

    calendariosDefinitivos.forEach((cal: any) => recorrer(cal));

    setVisibles(nuevos);
  }, [calendariosDefinitivos]);

  useEffect(() => {
    if (!calendariosDefinitivos || calendariosDefinitivos.length === 0) return;

    const nuevas: Record<string, boolean> = {};

    const recorrer = (cal: any) => {
      if (!cal) return;

      // recorrer eventos y extraer etiquetas
      cal.eventos?.forEach((ev: any) => {
        if (ev.etiqueta?.etiquetaId) {
          nuevas[ev.etiqueta.etiquetaId] = true;
        }
      });

      // recorrer subcalendarios
      const subs = Array.isArray(cal.subcalendarios) ? cal.subcalendarios : [];
      subs.forEach((sub: any) => recorrer(sub));
    };

    calendariosDefinitivos.forEach((cal: any) => recorrer(cal));

    // ✨ Solo actualizamos si el contenido real cambia,
    // para evitar loops infinitos de React
    setEtiquetasVisibles(prev => {
      const prevKeys = Object.keys(prev).sort();
      const newKeys = Object.keys(nuevas).sort();

      if (
        prevKeys.length === newKeys.length &&
        prevKeys.every((k, i) => k === newKeys[i])
      ) {
        return prev; // no cambia, no re-render obligatorio
      }

      return nuevas;
    });
  }, [calendariosDefinitivos]);

  useEffect(() => {
    async function cargar() {
      if (!id) {
        setCalendarioCargado(null);
        return;
      }

      // 1. Obtener el calendario REAL del backend
      const cal = await obtenerCalendarioPorId(id);

      if (!cal) {
        setCalendarioCargado(null);
        return;
      }

      // 2. Filtrar eventos reales del calendario
      const eventosDelCalendario = cal.eventos;

      // 3. Construir el DTO final
      const calendarioFinal: CalendarioDTO = {
        ...cal,
        eventos: eventosDelCalendario,
        subcalendarios: cal.subcalendarios || [],
      };

      setCalendarioCargado(calendarioFinal);
    }

    cargar(); // ← aquí llamas a la función async

  }, [id, eventosCompletos.length, calendariosDefinitivos.length]);


  // ======================================================================
  // ===================== Return (HTML de respuesta) =====================
  // ======================================================================

  return (
    <>
      <div className="todoCalendario">
        <div className="divBarraLateral">
          <BarraLateralCalendario
            calendarios={calendariosDefinitivos}
            visibles={visibles}
            setVisibles={setVisibles}
            etiquetas={etiquetasUnicas} 
            etiquetasVisibles={etiquetasVisibles}
            setEtiquetasVisibles={setEtiquetasVisibles}
            onCrearCalendario={abrirCrearCalendario}
            
            // --- PASAMOS LA FUNCIÓN PARA EDITAR ---
            onEditarCalendario={abrirEditarCalendario}
            calendarioId={id}
            idsFiltrar={idsFiltrar ?? undefined}
            esVistaGeneral={calendariosDefinitivos.length > 1}   // ⬅ NUEVO
          />
        </div>

        <div className="divCalendario">
          <CalendarioPrincipal
            calendarioActual={calendariosDefinitivos[0] || null}
            cantidadCalendarios={calendariosDefinitivos.length}
            eventosCalendario={eventosCompletos}
            etiquetasVisibles={etiquetasVisibles}
            visibles={visibles}
            eventoSeleccionado={eventoSeleccionado}
            setEventoSeleccionado={setEventoSeleccionado}
            onEliminarEvento={solicitarEliminarEvento}
            onEditarEvento={handleEditarEvento}
            onSeleccionarFecha={handleSeleccionarFecha}
          />
        </div>
      </div>

      {/* POPUP GESTIÓN CALENDARIOS */}
      {mostrarPopupCalendario && (
        <PopupCalendarioUnificado
          // --- TRUCO KEY: Forzamos recarga al cambiar calendario ---
          key={popupModoCalendario === 'crear' ? 'crear' : calendarioAEditar?._id}
          
          modo={popupModoCalendario}
          calendario={calendarioAEditar ?? undefined}
          onClose={() => setMostrarPopupCalendario(false)}
          onGuardar={(datos) =>
            popupModoCalendario === "crear"
              ? handleCrearCalendario(datos as CalendarioCrear)
              : handleEditarCalendario(datos as CalendarioModificar)
          }
        />
      )}

      {/* POPUP CREAR/EDITAR EVENTO */}
      {mostrarPopupEvento && (
        <EventoPopUpCrearEditar
          modo={modoEvento}
          onClose={cerrarPopupUnificado}
          calendarios={calendariosDefinitivos}
          etiquetas={todasLasEtiquetas} 
          usuarioId={usuario?._id || ""}
          evento={modoEvento === "editar" && eventoParaEditar ? eventoParaEditar : undefined}
          fechaPreseleccionada={modoEvento === "crear" ? fechaParaCrear : undefined}
          onGuardar={
            modoEvento === "crear" 
              ? handleGuardarEventoNuevo 
              : handleGuardarEventoEditado
          }
        />
      )}

      {/* POPUP CONFIRMACIÓN ELIMINAR */}
      {popupConfirmarEliminar && (
        <ConfirmacionPopUp
          mensaje="¿Estás seguro de que quieres eliminar este evento?"
          textoAceptar="Eliminar"
          textoCancelar="Cancelar"
          onAceptar={handleEliminarEvento}
          onCancelar={() => {
            setPopupConfirmarEliminar(false);
            setEventoIdAEliminar(null);
          }}
        />
      )}
    </>
  );
}