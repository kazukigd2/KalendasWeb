// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================

import React, { useState } from "react";
import "../../estilos/Calendario/BarraLateralCalendario.css";

//Imports propios
import { CalendarioDTO } from "../../schemas/KalendasSchemas";
import ojoAbierto from "../../imagenes/ojoAbierto.png";
import ojoCerrado from "../../imagenes/ojoCerrado.png";
import iconoEditar from "../../imagenes/IconoEditar.png";
import Boton from "../Boton";
import { useUsuario } from "../../contextos/UsuarioContext";

// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================

interface Props {
  calendarios: CalendarioDTO[];

  visibles: Record<string, boolean>;
  setVisibles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  etiquetas: any[];
  etiquetasVisibles: Record<string, boolean>;
  setEtiquetasVisibles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  onCrearCalendario: () => void;
  // --- NUEVA PROP ---
  onEditarCalendario: (cal: CalendarioDTO) => void;

  calendarioId?: string | undefined;
  idsFiltrar?: string[];

  esVistaGeneral: boolean;
}

// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================

export default function BarraLateralCalendario({
  calendarios,
  visibles,
  setVisibles,
  etiquetas,
  etiquetasVisibles,
  setEtiquetasVisibles,
  onCrearCalendario,
  onEditarCalendario,
  calendarioId,
  idsFiltrar,
  esVistaGeneral,
}: Props) {
  // Obtener usuario del contexto
  const { usuario } = useUsuario();

  // ---- Estado local ----
  const [desplegados, setDesplegados] = useState<Record<string, boolean>>({});
  const [busqueda, setBusqueda] = useState("");

  const normalizar = (txt: string) =>
    txt.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const filtro = normalizar(busqueda);

  const calendariosFiltrados =
    idsFiltrar && idsFiltrar.length > 0
      ? calendarios.filter((c) => idsFiltrar.includes(c._id))
      : calendarios;

  const etiquetasFiltradas = etiquetas;
  

  // ======================================================================
  // ========================== Funciones  ================================
  // ======================================================================
  const toggleDesplegado = (id: string) =>
    setDesplegados((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleVisible = (id: string) => {
    setVisibles((prev) => {
      const nuevo = { ...prev };
      const nuevoValor = !prev[id];

      nuevo[id] = nuevoValor;

      // Se aplican también a subcalendarios
      const cal = calendarios.find((c) => c._id === id);
      if (cal) {
        cal.subcalendarios.forEach((sub: any) => (nuevo[sub._id] = nuevoValor));
      }

      return nuevo;
    });
  };

  // ---- Determinar si el calendario es propio ----
  // Comprobamos varias propiedades posibles para adaptarnos a distintos nombres de campo
  const esPropioCalendario = (cal: CalendarioDTO): boolean => {
    if (!usuario?._id) return false;

    // lista de campos posibles que podrían contener el id del creador/propietario
    const posiblesCampos = [
      // @ts-ignore: comprobamos de forma defensiva
      cal.usuarioId,
      // @ts-ignore
      cal.creadorId,
      // @ts-ignore
      cal.usuarioCreadorId,
      // @ts-ignore
      cal.ownerId,
      // @ts-ignore
      cal.userId,
      // si el calendario incluye un objeto usuario dentro
      // @ts-ignore
      cal.usuario && cal.usuario._id,
    ];

    return posiblesCampos.some((v) => v === usuario?._id);
  };

  // ======================================================================
  // ===================== Return (HTML de respuesta) =====================
  // ======================================================================
  return (
    <div className="bodyBarraLateral">
      {/* ------------------ BUSCADOR ------------------ */}
      <input
        type="text"
        className="buscarSubcalendarios"
        value={busqueda}
        placeholder="Buscar..."
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* ------------------ CALENDARIOS ------------------ */}
      <div className="lista-calendarios">
        {calendariosFiltrados.map((cal) => {
          const tituloCal = normalizar(cal.titulo);

          const subFiltrados = cal.subcalendarios.filter((sub: any) => {
            const coincideBusqueda = normalizar(sub.titulo).includes(filtro);
            const coincideFiltroId = !idsFiltrar || idsFiltrar.includes(sub._id);
            return coincideBusqueda && coincideFiltroId;
          });

          const visible =
            tituloCal.includes(filtro) || subFiltrados.length > 0;

          if (!visible) return null;

          return (
            <div key={cal._id} className="item-calendario">
              <div className="visible-calendario-header">
                <div
                  className="div-calendario-flecha"
                  onClick={() => toggleDesplegado(cal._id)}
                >
                  <span className="titulo-calendario-barraLateral">
                    {cal.titulo}
                  </span>

                  <span className="flecha-barraLateral">
                    {desplegados[cal._id] ? "▼" : "▶"}
                  </span>
                </div>

                <div className="BotonesOjoyEditar">
                  {/* --- BOTÓN EDITAR (CALENDARIO PADRE) --- */}
                  <img
                    src={iconoEditar}
                    className={
                      "imagenEditar " +
                      (esPropioCalendario(cal) ? "icono-editar-visible" : "icono-editar-oculto")
                    }
                    onClick={() => esPropioCalendario(cal) ? onEditarCalendario(cal) : undefined}
                    alt="Editar calendario"
                  />

                  <img
                    src={(visibles[cal._id] ?? true) ? ojoAbierto : ojoCerrado}
                    className="imagenOjo"
                    onClick={() => toggleVisible(cal._id)}
                    alt={(visibles[cal._id] ?? true) ? "Visible" : "No visible"}
                  />
                </div>
              </div>
              

              {desplegados[cal._id] && (
                <div className="subcalendarios">
                  {(tituloCal.includes(filtro)
                    ? cal.subcalendarios
                    : subFiltrados
                  ).map((sub: any) => {
                    const esPropioSub = esPropioCalendario(sub);
                    return (
                      <div key={sub._id} className="item-subcalendario">
                        <div className="visible-calendario-header">
                          <span className="titulo-subcalendario">{sub.titulo}</span>

                          {/* --- BOTÓN EDITAR (SUBCALENDARIO) --- */}
                          <div className="BotonesOjoyEditar">
                            <img
                              src={iconoEditar}
                              className={
                                "imagenEditar " +
                                (esPropioCalendario(sub) ? "icono-editar-visible" : "icono-editar-oculto")
                              }
                              onClick={() => esPropioCalendario(sub) ? onEditarCalendario(sub) : undefined}
                              alt="Editar subcalendario"
                            />

                            <img
                              src={(visibles[sub._id] ?? true) ? ojoAbierto : ojoCerrado}
                              className="imagenOjo"
                              onClick={() => toggleVisible(sub._id)}
                              alt={(visibles[sub._id] ?? true) ? "Visible" : "No visible"}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ------------------ ETIQUETAS ------------------ */}
      <div className="lista-etiquetas">
        <h3 className="titulo-seccion">Etiquetas</h3>

        {etiquetasFiltradas.map((et) => (
          <div key={et.etiquetaId} className="item-etiqueta">
            <div className="div-etiqueta">
              <div className="etiqueta-color" style={{ backgroundColor: et.color }} />
              <span className="nombre-etiqueta">{et.etiqueta}</span>

              <img
                src={(etiquetasVisibles[et.etiquetaId] ?? true) ? ojoAbierto : ojoCerrado}
                className="imagenOjo"
                onClick={() =>
                  setEtiquetasVisibles((prev) => ({
                    ...prev,
                    [et.etiquetaId]: !prev[et.etiquetaId],
                  }))
                }
                alt={(etiquetasVisibles[et.etiquetaId] ?? true) ? "Visible" : "No visible"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ------------------ CREAR CALENDARIO ------------------ */}
      {/* El botón está siempre presente pero deshabilitado cuando no estamos en vista general */}
      <Boton onClick={onCrearCalendario} hidden={!esVistaGeneral}>
        + Crear Calendario
      </Boton>
    </div>
  );
}
