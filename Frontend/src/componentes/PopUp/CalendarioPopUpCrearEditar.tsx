// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React, { useState } from "react";

import "../../estilos/PopUp/CalendarioPopUp.css";

//Imports propios
import Boton from "../Boton";
import PopupRecorteImagen from "./RecorteImagenPopUp";
import {
  CalendarioCrear,
  CalendarioModificar,
  CalendarioDTO
} from "../../schemas/KalendasSchemas";
import imagenBaseCalendario from "../../imagenes/imagenBaseCalendario.png";
import Multimedia from "../Externos/Multimedia";
import { useUsuario } from "../../contextos/UsuarioContext";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
type Modo = "crear" | "editar";

interface Props {
  modo: Modo;
  calendario?: CalendarioDTO;
  onClose: () => void;
  onGuardar: (datos: CalendarioCrear | CalendarioModificar) => void;
}


// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
export default function PopupCalendarioUnificado({
  modo,
  calendario,
  onClose,
  onGuardar
}: Props) {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================
  const VALOR_DEFECTO_PORTADA = imagenBaseCalendario;

  //Formulario
  const [titulo, setTitulo] = useState(calendario?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(calendario?.descripcion ?? "");
  const [portada, setPortada] = useState(calendario?.portada ?? "");
  const [publico, setPublico] = useState(calendario?.publico ?? true);
  const [calendarioPadre, setCalendarioPadre] = useState(calendario?.calendarioPadre ?? "");
  
  //Desplegable calendarios propios en calendario padre
  const { calendarios } = useUsuario();

  //Portada
  const [mostrarRecorte, setMostrarRecorte] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [subiendoPortada, setSubiendoPortada] = useState(false);


// ======================================================================
// ========================== Funciones  ================================
// ======================================================================
const handlePortadaChange = (newUrls: string[]) => {
        if (newUrls.length > 0) {
            // Si hay fotos, cogemos la última que se haya añadido (reemplazo)
            setPortada(newUrls[newUrls.length - 1]);
            console.log("Nueva foto de perfil:", portada);
        } else {
            // Si han borrado todas, se queda vacío
            setPortada("");
        }
    };

  function handleGuardar() {
    if (!titulo.trim()) {
      alert("Debes añadir un título.");
      return;
    }

    if (modo === "crear") {
      const datosCrear: CalendarioCrear = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        publico,
        portada: portada.trim() || VALOR_DEFECTO_PORTADA,
        calendarioPadre: calendarioPadre || undefined
      };
      onGuardar(datosCrear);
    }

    else { // EDITAR
      const datosEditar: CalendarioModificar = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        publico,
        portada: portada.trim(),
        calendarioPadre: calendarioPadre || undefined
      };
      onGuardar(datosEditar);
    }
  }


// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
return (
  <>
    <div className="cal-popup-overlay" onClick={onClose}>
      <div className="cal-popup-card" onClick={(e) => e.stopPropagation()}>

        {/* CABECERA */}
        <div className="cal-popup-header">
          <h2>{modo === "crear" ? "Crear Calendario" : "Editar Calendario"}</h2>
          <button className="cal-popup-close" onClick={onClose}>✕</button>
        </div>

        {/* CONTENIDO SCROLABLE */}
        <div className="cal-popup-scroll">

          {/* TÍTULO */}
          <div className="cal-field">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="cal-field">
            <label>Descripción</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          {/* DESPLEGABLE CALENDARIO PADRE */}
          <div className="cal-field">
            <label>Calendario Principal</label>

            {(() => {
              // No permitir cambiar calendario padre si el calendario actual tiene subcalendarios
              const disableSelectPadre =
                modo === "editar" &&
                Array.isArray(calendario?.subcalendarios) &&
                calendario.subcalendarios.length > 0;

              return (
                <select
                  value={calendarioPadre}
                  onChange={(e) => setCalendarioPadre(e.target.value)}
                  disabled={disableSelectPadre}
                >
                  <option value="">(Ninguno - Calendario Raíz)</option>

                  {calendarios
                    // No permitir ser su propio padre
                    .filter((c) => modo === "crear" || c._id !== calendario?._id)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.titulo}
                      </option>
                    ))}
                </select>
              );
            })()}
          </div>


          {/* VISIBILIDAD */}
          <div className="cal-field">
            <label>Visibilidad</label>

            <div className="cal-radio">
              <input
                type="radio"
                id="publico"
                checked={publico}
                onChange={() => setPublico(true)}
              />
              <label htmlFor="publico">Público</label>
            </div>

            <div className="cal-radio">
              <input
                type="radio"
                id="privado"
                checked={!publico}
                onChange={() => setPublico(false)}
              />
              <label htmlFor="privado">Privado</label>
            </div>
          </div>
          {/* PORTADA */}
          <div className="cal-field">
            <label >Portada</label>
            
            <Multimedia 
                urls={portada ? [portada] : []}
                editable={true}
                onChange={handlePortadaChange}
                onUploadStatusChange={setSubiendoPortada}
                acceptedFileTypes="image/*" 
                allowMultiple={false}
            />
            
            <p>
                * Al subir una nueva foto, se reemplazará la anterior.
            </p>
        </div>

        </div>

        {/* BOTONES */}
        <div className="cal-popup-actions">
          <Boton tipo="mini-rojo" onClick={onClose}>Cancelar</Boton>
          <Boton onClick={handleGuardar}>
            {modo === "crear" ? "Crear Calendario" : "Guardar Cambios"}
          </Boton>
        </div>

      </div>
    </div>

    {/* RECORTE */}
    {mostrarRecorte && imagenSeleccionada && (
      <PopupRecorteImagen
        imagen={imagenSeleccionada}
        onCancelar={() => {
          setMostrarRecorte(false);
          setImagenSeleccionada(null);
        }}
        onRecortar={(rec) => {
          setPortada(rec);
          setMostrarRecorte(false);
          setImagenSeleccionada(null);
        }}
      />
    )}
  </>
);
}
