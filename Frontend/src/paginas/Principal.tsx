// ======================================================================
// ========================== IMPORTS ===================================
// ======================================================================
// Imports básicos
import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import "../estilos/Home.css";
import { useNavigate } from "react-router-dom";

// Imports propios
import { useUsuario } from "../contextos/UsuarioContext";
import Boton from "../componentes/Boton";
import PopupConfirmacion from "../componentes/PopUp/ConfirmacionPopUp";
import PopupCalendarioUnificado from "../componentes/PopUp/CalendarioPopUpCrearEditar";
import GoogleImportModal from "../componentes/PopUp/GoogleImportModal";

import exportarIcono from "../imagenes/IconoExportar.svg";
import linkIcono from "../imagenes/IconoLink.svg";
import editarIcono from "../imagenes/IconoEditar.svg";
import eliminarIcono from "../imagenes/IconoEliminar.svg";
import imagenBaseCalendario from "../imagenes/imagenBaseCalendario.png";
import cruzIcono from "../imagenes/IconoCruz.svg";
import { GOOGLE_PUBLIC_CALENDARS } from "../utils/GoogleCalendariosPublicos";
import { importarCalendarioGooglePublico, mapGoogleCalendarToKalendas, listarCalendariosGoogle, importarCalendarioGooglePrivado } from "../services/GoogleCalendarService";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { obtenerEventosDeUnCalendario, importarCalendario, obtenerTokenProvider, sincronizarUsuario } from "../services/KalendasService";

import {
  CalendarioDTO,
  CalendarioCrear,
  EtiquetaDTO,
  UsuarioLoginDTO,
} from "../schemas/KalendasSchemas";

// ======================================================================
// ========================= EXPORTAR JSON ===============================
// ======================================================================
export async function exportarCalendarioJSON(cal: CalendarioDTO) {
  interface EventoExportado {
    titulo: string;
    descripcion: string;
    fechaCreacion: string;
    fechaComienzo: string;
    fechaFinal: string;
    lugar: string;
    etiqueta: EtiquetaDTO | null;
    latitud: number | null;
    longitud: number | null;
    multimedia: string[];
  }

  interface CalendarioExportado {
    titulo: string;
    portada: string;
    descripcion: string;
    publico: boolean;
    fechaCreacion: string;
    calendarioPadre: string | null;
    eventos: EventoExportado[];
    subcalendarios: CalendarioExportado[];
  }

  async function convertirCalendario(calActual: CalendarioDTO): Promise<CalendarioExportado> {
    const eventos = await obtenerEventosDeUnCalendario(calActual._id);

    const eventosConvertidos = eventos.map((ev) => ({
      titulo: ev.titulo,
      descripcion: ev.descripcion,
      fechaCreacion: ev.fechaCreacion,
      fechaComienzo: ev.fechaComienzo,
      fechaFinal: ev.fechaFinal,
      lugar: ev.lugar,
      etiqueta: ev.etiqueta
        ? {
            etiquetaId: ev.etiqueta.etiquetaId,
            etiqueta: ev.etiqueta.etiqueta,
            color: ev.etiqueta.color,
          }
        : null,
      latitud: ev.latitud ?? null,
      longitud: ev.longitud ?? null,
      multimedia: ev.multimedia ?? [],
    }));

    const subExportados: CalendarioExportado[] = [];
    if (calActual.subcalendarios?.length) {
      for (const sub of calActual.subcalendarios) {
        subExportados.push(await convertirCalendario(sub as any));
      }
    }

    return {
      titulo: calActual.titulo,
      portada: calActual.portada ?? "",
      descripcion: calActual.descripcion,
      publico: calActual.publico,
      fechaCreacion: calActual.fechaCreacion,
      calendarioPadre: calActual.calendarioPadre ?? null,
      eventos: eventosConvertidos,
      subcalendarios: subExportados,
    };
  }

  const resultado = await convertirCalendario(cal);

  const blob = new Blob([JSON.stringify(resultado, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `calendario_${cal.titulo}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ======================================================================
// ============================ COMPONENTE ==============================
// ======================================================================

const Home: React.FC = () => {
  const {
    usuario,
    calendarios,
    calendariosSuscritos,
    crearCalendarioGlobal,
    editarCalendarioGlobal,
    eliminarCalendarioGlobal,
    desuscribirseGlobal,
    recargarCalendarios,
  } = useUsuario();

  const usuarioId = usuario?._id;
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ======================================================================
  // ========================== ESTADOS ==================================
  // ======================================================================
  // Mostrar o ocultar calendarios creados
  const [mostrarTodosCreados, setMostrarTodosCreados] = useState(false);

  // Mostrar o ocultar calendarios suscritos
  const [mostrarTodosSuscritos, setMostrarTodosSuscritos] = useState(false);

  // Cantidad a mostrar inicialmente
  const MAX_VISIBLE = 3;

  const portadaBase = "/img/default-portada.png";
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const [popupEliminar, setPopupEliminar] = useState(false);
  const [calendarioAEliminar, setCalendarioAEliminar] = useState<CalendarioDTO | null>(null);

  const [popupConfirmarDesuscribir, setPopupConfirmarDesuscribir] = useState(false);
  const [calendarioADesuscribir, setCalendarioADesuscribir] = useState<CalendarioDTO | null>(null);

  const [popupCalendario, setPopupCalendario] = useState(false);
  const [popupModo, setPopupModo] = useState<"crear" | "editar">("crear");
  const [calendarioAEditar, setCalendarioAEditar] = useState<CalendarioDTO | null>(null);

  const [popup, setPopup] = useState<{ mensaje: string; visible: boolean; }>({ mensaje: "", visible: false });
  const [cargando, setCargando] = useState(true);
  const [calendariosPublicos, setCalendariosPublicos] = useState<CalendarioDTO[]>([]);

  // Mostrar / ocultar desplegable Google
  const [mostrarSelectGoogle, setMostrarSelectGoogle] = useState(false);


  const [menuGoogleAbierto, setMenuGoogleAbierto] = useState(false);
  const [animandoMenuGoogle, setAnimandoMenuGoogle] = useState(false);
  const [importandoGoogle, setImportandoGoogle] = useState(false);

  const googleMenuRef = useRef<HTMLDivElement | null>(null);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCalendars, setGoogleCalendars] = useState<any[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  // ======================================================================
  // ========================== FUNCIONES ================================
  // ======================================================================
  
  // =========================================================
  // FUNCIÓN CORREGIDA PARA ABRIR POPUP Y PEDIR PERMISOS
  // =========================================================
  const abrirPopUpGoogle = async () => {
    if (!usuario?._id) return;
    
    setLoadingGoogle(true);
    console.log("🚀 Iniciando proceso de Google Calendar...");

    // 1. Intentamos leer el token guardado
    let token = localStorage.getItem("provider_token") || await obtenerTokenProvider(usuario._id);
    
    // Función auxiliar para forzar el login y pedir permisos
    const pedirPermisosCalendario = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        
        provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
        provider.setCustomParameters({
            prompt: 'select_account consent',
            access_type: 'offline'
        });

        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const newToken = credential?.accessToken;
            const datosParaBackend: UsuarioLoginDTO  = {
                id: result.user.uid,
                email: result.user.email || "no-email@google.com", 
                alias: result.user.displayName,
                foto: result.user.photoURL,
                provider_token: newToken || null
            };
            // Solo sincronizamos (Login/Registro en Mongo)
            await sincronizarUsuario(datosParaBackend);

            if (newToken) {
                console.log("✅ Nuevo token conseguido:", newToken.substring(0, 10) + "...");
                localStorage.setItem("provider_token", newToken);
                return newToken;
            }
            return null;
        } catch (err) {
            console.error("❌ Error o cancelación en el popup:", err);
            return null;
        }
    };

    try {
        // 2. Si hay token, probamos a usarlo
        if (token) {
            try {
                console.log("🔄 Intentando listar con token existente...");
                const lista = await listarCalendariosGoogle(token);
                
                // Si llegamos aquí, el token es BUENO
                console.log("✅ Lista cargada correctamente.");
                setGoogleCalendars(lista);
                setShowGoogleModal(true);
                setLoadingGoogle(false);
                return; // ¡Éxito!
            } catch (error) {
                localStorage.removeItem("provider_token"); // Borrón y cuenta nueva
            }
        }

        // 3. Si no había token o el antiguo falló, pedimos uno nuevo
        token = await pedirPermisosCalendario();

        if (token) {
            console.log("🔄 Reintentando listar con el token NUEVO...");
            const lista = await listarCalendariosGoogle(token);
            setGoogleCalendars(lista);
            setShowGoogleModal(true);
        } else {
            setPopup({ mensaje: "Para importar, necesitas dar permisos en la ventana de Google.", visible: true });
        }

    } catch (error) {
        console.error("❌ Error final fatal:", error);
        setPopup({ mensaje: "Ocurrió un error al conectar con Google.", visible: true });
    } finally {
        setLoadingGoogle(false);
    }
  };

  const handleSeleccionGoogle = async (calId: string, calName: string) => {
    if (!usuario?._id) return;

    try {
        // 1. Cerramos el modal pero indicamos que empieza el proceso
        setShowGoogleModal(false); 
        setPopup({ mensaje: `Importando "${calName}"...`, visible: true });
        
        // 2. ⚠️ CLAVE: Recuperamos el token "fresco" del navegador
        // Si no está en localStorage, intentamos el de la BD, pero ese suele fallar.
        const token = localStorage.getItem("provider_token") || await obtenerTokenProvider(usuario._id);
        
        // Debug para ver en consola si tenemos token
        console.log("Token usado para importar:", token ? "Token presente" : "Sin token");

        if (!token) {
             setPopup({ mensaje: "Error: No hay token de Google disponible.", visible: true });
             return;
        }

        // 3. Llamamos al servicio
        const resultado = await importarCalendarioGooglePrivado(calId, usuario._id, token);

        if (resultado.ok) {
            setPopup({ mensaje: "¡Calendario importado correctamente!", visible: true });
            recargarCalendarios();
        } else {
            // Si falla, mostramos el error
            console.error("Error importando:", resultado);
            setPopup({ mensaje: "Error al importar: Permisos insuficientes o calendario vacío.", visible: true });
        }
    } catch (error) {
        console.error("Excepción al importar:", error);
        setPopup({ mensaje: "Error inesperado al conectar con Google.", visible: true });
    }
  };

  const toggleMenuGoogle = () => {
    if (menuGoogleAbierto) {
      setAnimandoMenuGoogle(true);
      setTimeout(() => {
        setMenuGoogleAbierto(false);
        setAnimandoMenuGoogle(false);
      }, 200);
    } else {
      setMenuGoogleAbierto(true);
      setAnimandoMenuGoogle(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        menuGoogleAbierto &&
        googleMenuRef.current &&
        !googleMenuRef.current.contains(target) &&
        googleButtonRef.current &&
        !googleButtonRef.current.contains(target)
      ) {
        setMenuGoogleAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuGoogleAbierto]);

   useEffect(() => {
      const cargarDatos = async () => {
        try {
          setCargando(true);
          recargarCalendarios();
        } catch (error) {
          console.error("Error al cargar calendarios propios o suscritos:", error);
        } finally {
          setCargando(false);
        }
      };
      cargarDatos();
    }, []);
  const creadosVisibles = mostrarTodosCreados
  ? calendarios
  : calendarios.slice(0, MAX_VISIBLE);

  const creadosOcultos = calendarios.length - creadosVisibles.length;

  const suscritosVisibles = mostrarTodosSuscritos
    ? calendariosSuscritos
    : calendariosSuscritos.slice(0, MAX_VISIBLE);

  const suscritosOcultos = calendariosSuscritos.length - suscritosVisibles.length;

  const abrirSelectorFichero = () => {
    fileInputRef.current?.click();
  };

  const handleImportarCalendario = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      const archivo = e.target.files[0];

      if (archivo.size > 5 * 1024 * 1024) {
        setPopup({
          mensaje: "El archivo JSON es demasiado grande (máx. 5 MB).",
          visible: true
        });
        return;
      }

      const contenido = await archivo.text();
      const json = JSON.parse(contenido);

      if (!json.titulo || !json.eventos || !json.subcalendarios) {
        setPopup({ mensaje: "JSON inválido o incompleto.", visible: true });
        return;
      }

      if (!usuarioId) {
        setPopup({
          mensaje: "Usuario no encontrado. Vuelve a iniciar sesión.",
          visible: true
        });
        return;
      }

      const resultado = await importarCalendario(usuarioId, json);

      if (!resultado.ok) {
        setPopup({
          mensaje: resultado.mensaje ?? "Error importando el calendario",
          visible: true
        });
        return;
      }

      setPopup({
        mensaje: "Calendario importado correctamente.",
        visible: true
      });

      await recargarCalendarios();

    } catch (err) {
      console.error(err);
      setPopup({
        mensaje: "Error importando el calendario.",
        visible: true
      });
    } finally {
      e.target.value = "";
    }
  };

  const toggleMenu = (id: string) => setMenuAbierto(menuAbierto === id ? null : id);

  const confirmarEliminar = async () => {
    if (!calendarioAEliminar) return;
    await eliminarCalendarioGlobal(calendarioAEliminar._id);
    setPopupEliminar(false);
  };

  const handleDesuscribirCalendario = async () => {
    if (!calendarioADesuscribir) return;

    const ok = await desuscribirseGlobal(calendarioADesuscribir._id);
    if (!ok) {
      setPopup({ mensaje: "Error al desuscribirse.", visible: true });
      return;
    }

    await recargarCalendarios();
    setPopupConfirmarDesuscribir(false);
  };

  //------------------IMPORTAR GOOGLE CALENDAR--------------------

  async function handleImportarCalendarioGoogle(calendarId: string) {
    if (!usuario?._id || importandoGoogle) return;

    try {
      setImportandoGoogle(true);
      setMenuGoogleAbierto(false);

      const resultado = await importarCalendarioGooglePublico(
        calendarId,
        usuario._id
      );

      if (!resultado.ok) {
      setPopup({
        mensaje: resultado.mensaje ?? "Error importando calendario",
        visible: true
      });
      return;
    }

      await recargarCalendarios();

      setPopup({
        mensaje: "Calendario importado correctamente",
        visible: true
      });

    } catch (err) {
      console.error(err);
      setPopup({
        mensaje: "Error inesperado importando calendario",
        visible: true
      });
    } finally {
      setImportandoGoogle(false);
    }
  }



  // -----------------------------------------

  // ======================================================================
  // ============================ RETURN =================================
  // ======================================================================
  return (
    <>
      {/* ====================== CABECERA ====================== */}
      <div className="home-header">
        <div className="home-header-content">
          
          <h1 className="home-title">Tus calendarios</h1>
          
          <p className="home-subtitle">
            Gestiona, crea y organiza tus calendarios personales.
          </p>
        </div>
      </div>

      {/* ====================== CONTENIDO PRINCIPAL ====================== */}
      <div className="home-container">

        {/* ====================== Calendarios creados ====================== */}
        <div className="wrap-titulo-cal">
          <h2 className="seccion-titulo">Calendarios creados</h2>

          {/* ===== IMPORTAR GOOGLE CALENDAR ===== */}
         <div className="boton-importar-cal" onClick={abrirPopUpGoogle}>
            <img src={exportarIcono} className="icono-importar" alt="Google" />
            Importar de Google Calendar
          </div>


          {/* --- BOTÓN IMPORTAR CALENDARIO --- */}
          <div className="boton-importar-cal" onClick={abrirSelectorFichero}>
            <img src={exportarIcono} className="icono-importar" />
            Importar Calendario
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImportarCalendario}
          />
        </div>

        <div className="calendarios-grid">
          {/* Botón Crear */}
          <div
            className="calendario-card boton-crear"
            onClick={() => {
              setPopupModo("crear");
              setCalendarioAEditar(null);
              setPopupCalendario(true);
            }}
          >
            <Boton tipo="icono" disabled>
              + <br />
              Crear nuevo calendario
            </Boton>
          </div>

          {creadosVisibles.map((cal) => (
            <div
              key={cal._id}
              className="calendario-card"
              onMouseLeave={() => menuAbierto === cal._id && setMenuAbierto(null)}
            >
              <img
                src={cal.portada || imagenBaseCalendario}
                className="calendario-img"
                onClick={() => navigate(`/calendario/${cal._id}`)}
              />

              <div className="calendario-info">
                <span className="calendario-titulo">{cal.titulo}</span>

                <Boton tipo="icono" onClick={() => toggleMenu(cal._id)}>
                  <FaEllipsisH />
                </Boton>
              </div>

              {menuAbierto === cal._id && (
                <div className="dropdown-menu">
                  <p
                    onClick={async () => {
                      await exportarCalendarioJSON(cal);

                      setPopup({ mensaje: "Calendario exportado correctamente.", visible: true, });
                    }}
                  >
                    <img src={exportarIcono} className="icono-opciones" /> Exportar Calendario
                  </p>


                  <p
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/calendario/${cal._id}`
                      );

                      setPopup({ mensaje: "Link copiado al portapapeles.", visible: true,});
                    }}
                  >

                    <img src={linkIcono} className="icono-opciones" /> Copiar link
                  </p>

                  <p
                    onClick={() => {
                      setPopupModo("editar");
                      setCalendarioAEditar(cal);
                      setPopupCalendario(true);
                      setMenuAbierto(null);
                    }}
                  >
                    <img src={editarIcono} className="icono-opciones" /> Editar
                  </p>

                  <p
                    className="eliminar"
                    onClick={() => {
                      setCalendarioAEliminar(cal);
                      setPopupEliminar(true);
                      setMenuAbierto(null);
                    }}
                  >
                    <img src={eliminarIcono} className="icono-opciones" /> Eliminar
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {calendarios.length > MAX_VISIBLE && (
        <div className="ver-mas-wrapper">
          <button
            className="ver-mas-btn"
            onClick={() => setMostrarTodosCreados(!mostrarTodosCreados)}
          >
            {mostrarTodosCreados
              ? "Ver menos ▲"
              : `Ver más (${creadosOcultos}) ▼`}
          </button>
        </div>
      )}

        {/* ====================== Calendarios suscritos ====================== */}
        <h2 className="seccion-titulo">Calendarios suscritos</h2>

        <div className="calendarios-grid">

          <div
            className="calendario-card boton-crear"
            onClick={() => navigate(`/buscar-calendarios`)}
          >
            <Boton tipo="icono" disabled>
              + <br />
              Suscribirse a nuevos calendarios
            </Boton>
          </div>

          {suscritosVisibles.map((cal) => (
            <div
              key={cal._id}
              className="calendario-card"
              onMouseLeave={() => menuAbierto === cal._id && setMenuAbierto(null)}
            >
              <img
                src={cal.portada || imagenBaseCalendario}
                className="calendario-img"
                onClick={() => navigate(`/calendario/${cal._id}`)}
              />

              <div className="calendario-info">
                <span className="calendario-titulo">{cal.titulo}</span>

                <Boton tipo="icono" onClick={() => toggleMenu(cal._id)}>
                  <FaEllipsisH />
                </Boton>
              </div>

              {menuAbierto === cal._id && (
                <div className="dropdown-menu">
                  <p
                    className="eliminar"
                    onClick={() => {
                      setCalendarioADesuscribir(cal);
                      setPopupConfirmarDesuscribir(true);
                      setMenuAbierto(null);
                    }}
                  >
                    <img
                        src={cruzIcono}
                        className="icono-opciones icono-opciones"
                    /> Desuscribirse
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {calendariosSuscritos.length > MAX_VISIBLE && (
        <div className="ver-mas-wrapper">
          <button
            className="ver-mas-btn"
            onClick={() => setMostrarTodosSuscritos(!mostrarTodosSuscritos)}
          >
            {mostrarTodosSuscritos
              ? "Ver menos ▲"
              : `Ver más (${suscritosOcultos}) ▼`}
          </button>
        </div>
      )}
      </div>

      {/* POPUPS */}
      {popupEliminar && calendarioAEliminar && (
        <PopupConfirmacion
          mensaje={`¿Eliminar el calendario "${calendarioAEliminar.titulo}"?`}
          onCancelar={() => setPopupEliminar(false)}
          onAceptar={confirmarEliminar}
        />
      )}

      {popupCalendario && (
        <PopupCalendarioUnificado
          modo={popupModo}
          calendario={calendarioAEditar ?? undefined}
          onClose={() => setPopupCalendario(false)}
          onGuardar={async (datos) => {
            if (popupModo === "crear") {
              await crearCalendarioGlobal(datos as CalendarioCrear);
            } else if (calendarioAEditar) {
              await editarCalendarioGlobal(calendarioAEditar._id, datos);
            }
            setPopupCalendario(false);
          }}
        />
      )}

      {popupConfirmarDesuscribir && calendarioADesuscribir && (
        <PopupConfirmacion
          mensaje={`¿Estás seguro de desuscribirte de "${calendarioADesuscribir.titulo}"?`}
          textoAceptar="Desuscribirse"
          textoCancelar="Cancelar"
          onAceptar={handleDesuscribirCalendario}
          onCancelar={() => setPopupConfirmarDesuscribir(false)}
        />
      )}

      {popup.visible && (
        <PopupConfirmacion
          mensaje={popup.mensaje}
          onAceptar={() => setPopup({ ...popup, visible: false })}
          textoCancelar=""      // solo un botón
        />
      )}
      <GoogleImportModal 
         isOpen={showGoogleModal}
         onClose={() => setShowGoogleModal(false)}
         calendarios={googleCalendars}
         loading={loadingGoogle}
         onSelect={handleSeleccionGoogle}
      />
    </>
  );
};

export default Home;
