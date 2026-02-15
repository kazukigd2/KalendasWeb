// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../estilos/PopUp/EventoPopUp.css"; 
import Boton from "../Boton";
import ConfirmacionPopUp from "./ConfirmacionPopUp"; 

// Importamos los componentes externos
import Mapa from "../Externos/Mapa"; 
import Multimedia from "../Externos/Multimedia";
import { useUsuario } from "../../contextos/UsuarioContext";

import {
  EventoDTO,
  EventoCrear,
  EventoModificar,
  CalendarioDTO,
  EtiquetaDTO
} from "../../schemas/KalendasSchemas";

type Modo = "crear" | "editar";
type OnGuardar =
  | ((datos: EventoCrear) => void)
  | ((eventoId: string, datos: EventoModificar) => void);

interface Props {
  modo: Modo;
  evento?: EventoDTO;                 
  usuarioId?: string;           
  fechaPreseleccionada?: string; 
  calendarios?: CalendarioDTO[]; 
  etiquetas?: EtiquetaDTO[]; 
  onClose: () => void;
  onGuardar: OnGuardar;
}

const formatDateLocal = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
};

// ======================================================================
// ============================ COMPONENTE ===============================
// ======================================================================

export default function EventoPopUpCrearEditar({
  modo,
  evento,
  usuarioId,
  fechaPreseleccionada,
  calendarios = [], 
  etiquetas = [], 
  onClose,
  onGuardar,
}: Props) {

  const { id } = useParams<{ id?: string}>();

  const calendarioBloqueado = Boolean(id);

  const original = evento?.evento;
    const {
       calendarios: calendariosUsuario ,
    } = useUsuario();

    console.log("Original:", original);
  
  const obtenerListaPlana = (lista: CalendarioDTO[]) => {
      const resultado: { _id: string, titulo: string }[] = [];
      
      const recorrer = (cals: any[]) => {
          cals.forEach(cal => {
              resultado.push({ _id: cal._id, titulo: cal.titulo });
              if (cal.subcalendarios?.length > 0) recorrer(cal.subcalendarios);
          });
      };
      recorrer(lista);
      return resultado;
  };
  const listaCalendarios = obtenerListaPlana(calendariosUsuario);

  // Estados Formulario
  const [titulo, setTitulo] = useState(original?.titulo || "");
  const [descripcion, setDescripcion] = useState(original?.descripcion || "");
  const [lugar, setLugar] = useState(original?.lugar || "");
  
  // --- ESTADOS PARA IMÁGENES (Usando el componente Multimedia) ---
  const [multimedia, setMultimedia] = useState<string[]>(original?.multimedia || []);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false); // Para bloquear el guardado

  // === ESTADOS PARA COORDENADAS (Usando el componente Mapa) ===
  const [latitud, setLatitud] = useState<number | undefined>((original as any)?.latitud);
  const [longitud, setLongitud] = useState<number | undefined>((original as any)?.longitud);

  const handleCoordenadasChange = (lat: number, lon: number) => {
      setLatitud(lat);
      setLongitud(lon);
  };

  const getFechaInicial = () => {
    if (original) return formatDateLocal(original.fechaComienzo);
    if (fechaPreseleccionada) return fechaPreseleccionada.length <= 10 ? `${fechaPreseleccionada}T09:00` : formatDateLocal(fechaPreseleccionada);
    return "";
  };
  const getFechaFinal = () => {
    if (original) return formatDateLocal(original.fechaFinal);
    if (fechaPreseleccionada) return fechaPreseleccionada.length <= 10 ? `${fechaPreseleccionada}T10:00` : formatDateLocal(fechaPreseleccionada);
    return "";
  };

  const [inicio, setInicio] = useState(getFechaInicial());
  const [fin, setFin] = useState(getFechaFinal());

  
  
  const [calSeleccionado, setCalSeleccionado] = useState<string>(() => {
    if (modo === "editar" && original?.calendarioId) {
      return original.calendarioId;   
    }
    if (id) return id;
    if (listaCalendarios.length > 0) return listaCalendarios[0]._id;
    return "";
  });
  
  const [etiquetaSelId, setEtiquetaSelId] = useState<string>(() => {
    if (original?.etiqueta?.etiquetaId) return original.etiqueta.etiquetaId;
    if (etiquetas && etiquetas.length > 0) return etiquetas[0].etiquetaId;
    return "";
  });

  const [errorVisible, setErrorVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  

  

  const mostrarError = (msg: string) => { setMensajeError(msg); setErrorVisible(true); };
  const cerrarError = () => { setErrorVisible(false); setMensajeError(""); };

  // --- GUARDAR ---
  const handleGuardar = () => {
    // 1. Verificación de subida en progreso
    if (new Date(inicio) > new Date(fin)) {
        mostrarError("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return;
    }

    if (subiendoImagenes) {
      mostrarError("Por favor, espera a que terminen de subirse las imágenes.");
      return;
    }

    if (!titulo.trim() || !inicio.trim() || !fin.trim()) {
      mostrarError("El título, la fecha de inicio y la fecha de fin son obligatorios.");
      return; 
    }

    if (!etiquetaSelId) {
        mostrarError("Es obligatorio seleccionar una etiqueta.");
        return;
    }

    const objetoEtiqueta = etiquetas.find(e => e.etiquetaId === etiquetaSelId) || null;

    const datosBase = {
        titulo, 
        descripcion, 
        fechaComienzo: inicio, 
        fechaFinal: fin, 
        lugar,
        etiqueta: objetoEtiqueta,
        latitud: latitud,
        longitud: longitud,
        multimedia: multimedia 
    };

    if (modo === "crear") {
      if (!calSeleccionado) {
          mostrarError("Debes seleccionar un calendario para crear el evento.");
          return; 
      }

      const data: EventoCrear = {
        ...datosBase,
        calendarioId: calSeleccionado, 
        usuarioId: usuarioId!,       
      };
      (onGuardar as (d: EventoCrear) => void)(data as any);
      return;
    }

    if (modo === "editar") {
      const data: EventoModificar = {
        ...datosBase,
        calendarioIdNuevo: calSeleccionado, 
      };
      
      const id = original!._id;
      (onGuardar as (id: string, d: EventoModificar) => void)(id, data as any);
      return;
    }
  };

  // ======================================================================
  // ===================== Return (HTML de respuesta) =====================
  // ======================================================================

  return (
    <div className="evento-popup-overlay" onClick={onClose}>
      <div className="evento-popup-card" onClick={(e) => e.stopPropagation()}>

        {/* CABECERA PREMIUM */}
        <div className="evento-popup-header">
          <h2>{modo === "crear" ? "Crear Evento" : "Editar Evento"}</h2>
          <button className="evento-popup-close" onClick={onClose}>✕</button>
        </div>

        {/* CONTENIDO SCROLABLE */}
        <div className="evento-popup-scroll">

          {/* CELDA DEL CALENDARIO (solo al crear) */}
          
            <div className="ev-field">
              <label>Calendario</label>
              <select value={calSeleccionado}
                onChange={(e) => setCalSeleccionado(e.target.value)}
                disabled={calendarioBloqueado}>
                {listaCalendarios.map((cal) => (
                  <option key={cal._id} value={cal._id}>{cal.titulo}</option>
                ))}
              </select>
            </div>
          

          {/* TITULO */}
          <div className="ev-field">
            <label>Título</label>
            <input type="text" value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              autoFocus
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="ev-field">
            <label>Descripción</label>
            <textarea rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* ETIQUETA */}
          <div className="ev-field">
            <label>Etiqueta</label>
            <select
              value={etiquetaSelId}
              onChange={(e) => setEtiquetaSelId(e.target.value)}
              className="select-etiqueta"
            >
              {etiquetas.map((et) => (
                <option
                  key={et.etiquetaId}
                  value={et.etiquetaId}
                  style={{
                    backgroundColor: et.color,
                    color: "#fff",
                    paddingLeft: "10px"
                  }}
                >
                  {et.etiqueta}
                </option>
              ))}
            </select>
          </div>

          {/* FECHAS (2 columnas si hay espacio) */}
          <div className="ev-two-col">
            <div className="ev-field">
              <label>Inicio</label>
              <input type="datetime-local" value={inicio}
                onChange={(e) => setInicio(e.target.value)} />
            </div>

            <div className="ev-field">
              <label>Fin</label>
              <input type="datetime-local" value={fin}
                onChange={(e) => setFin(e.target.value)} />
            </div>
          </div>

          {/* LUGAR TEXTO */}
          <div className="ev-field">
            <label>Lugar (Texto)</label>
            <input type="text" value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej: Gimnasio Municipal" />
          </div>

          {/* MAPA COMPLETO */}
          <div className="ev-field">
            <label>Ubicación (Mapa)</label>

            <div className="ev-map-wrapper">
              <Mapa
                latitud={latitud}
                longitud={longitud}
                editable={true}
                onCoordenadasChange={handleCoordenadasChange}
              />
            </div>
          </div>

          {/* MULTIMEDIA */}
          <div className="ev-field">
            
            <Multimedia
              urls={multimedia}
              editable={true}
              onChange={(urls) => setMultimedia(urls)}
              onUploadStatusChange={(x) => setSubiendoImagenes(x)}
            />
          </div>

        </div>

        {/* BOTONES ABAJO FIJOS */}
        <div className="evento-popup-actions">
          <Boton tipo="mini-rojo" onClick={onClose}>Cancelar</Boton>

          <Boton onClick={handleGuardar} disabled={subiendoImagenes}>
            {subiendoImagenes ? "Subiendo..." : modo === "crear" ? "Crear Evento" : "Guardar Cambios"}
          </Boton>
        </div>

      </div>

      {/* POPUP ERROR */}
      {errorVisible && (
        <ConfirmacionPopUp
          mensaje={mensajeError}
          textoAceptar="Aceptar"
          textoCancelar=""
          onAceptar={cerrarError}
          error={true}
        />
      )}
    </div>
  );
}