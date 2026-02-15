import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from './AuthContext';
import {
  CalendarioDTO,
  EventoDTO,
  NotificacionRespuesta,
  CalendarioCrear,
  CalendarioModificar,
  UsuarioRespuesta
} from "../schemas/KalendasSchemas";

import {
  sincronizarUsuario,
  crearCalendario,
  editarCalendario,
  eliminarCalendario,
  listarCalendariosPropios,
  obtenerEventoPorId,
  suscribirseACalendario,
  desuscribirseDeCalendario,
  listarCalendariosSuscritos,
  listarNotificaciones,
} from "../services/KalendasService";


// =======================================================
// TIPO DEL CONTEXTO (actualizado para usar usuario)
// =======================================================
interface UsuarioContextType {
  usuario: UsuarioRespuesta | null;

  calendarios: CalendarioDTO[];
  eventos: EventoDTO[];
  notificaciones: (NotificacionRespuesta & { removing?: boolean })[];
  calendariosSuscritos: CalendarioDTO[];
  usuarioLoading: boolean;
  
  actualizarUsuario: (u: UsuarioRespuesta | null) => void;
  setUsuario: (u: UsuarioRespuesta | null) => void;
  setCalendarios: (cal: CalendarioDTO[]) => void;
  setEventos: (ev: EventoDTO[]) => void;
  setNotificaciones: (n: (NotificacionRespuesta & { removing?: boolean })[]) => void;
  setCalendariosSuscritos: (c: CalendarioDTO[]) => void;

  crearCalendarioGlobal: (datos: CalendarioCrear) => Promise<boolean>;
  editarCalendarioGlobal: (id: string, datos: CalendarioModificar) => Promise<boolean>;
  eliminarCalendarioGlobal: (id: string) => Promise<boolean>;
  recargarCalendarios: () => Promise<void>;
  suscribirseGlobal: (calendarioId: string) => Promise<boolean>;
  desuscribirseGlobal: (calendarioId: string) => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);



// =======================================================
// Extraer IDs de todos los eventos del árbol de calendarios
// =======================================================
function extraerIdsEventos(calendarios: CalendarioDTO[]): string[] {
  const ids: string[] = [];

  calendarios.forEach((cal) => {
    if (cal.eventos?.length > 0) {
      ids.push(...cal.eventos.map(e => e._id));
    }

    if (cal.subcalendarios?.length > 0) {
      cal.subcalendarios.forEach(sub =>
        sub.eventos?.length ? ids.push(...sub.eventos.map(e => e._id)) : null
      );
    }
  });

  return ids;
}



// =======================================================
// PROVIDER
// =======================================================
export const UsuarioProvider = ({ children }: { children: ReactNode }) => {

  // ---- Recuperar estado desde localStorage ----
  const storedUsuario = localStorage.getItem("usuario");
  const storedCalendarios = localStorage.getItem("calendarios");
  const storedNotificaciones = localStorage.getItem("notificaciones");
  const storedEventos = localStorage.getItem("eventos");
  const storedCalendariosSuscritos = localStorage.getItem("calendariosSuscritos");

  const [usuario, setUsuario] = useState<UsuarioRespuesta | null>(
    storedUsuario ? JSON.parse(storedUsuario) : null
  );

  const actualizarUsuario = (u: UsuarioRespuesta | null) => {
    if (u) {
      u.recibirNotificaciones = u.recibirNotificaciones === true;
    }
  setUsuario(u);
  if (u) localStorage.setItem("usuario", JSON.stringify(u));
  else localStorage.removeItem("usuario");
};

  const [calendarios, setCalendarios] = useState<CalendarioDTO[]>(
    storedCalendarios ? JSON.parse(storedCalendarios) : []
  );

  const [notificaciones, setNotificaciones] = useState<
    (NotificacionRespuesta & { removing?: boolean })[]
  >(storedNotificaciones ? JSON.parse(storedNotificaciones) : []);

  const [eventos, setEventos] = useState<EventoDTO[]>(
    storedEventos ? JSON.parse(storedEventos) : []
  );

  const [calendariosSuscritos, setCalendariosSuscritos] = useState<CalendarioDTO[]>(
    storedCalendariosSuscritos ? JSON.parse(storedCalendariosSuscritos) : []
  );

  
  // ---- Guardar en localStorage ----
  useEffect(() => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem("calendarios", JSON.stringify(calendarios));
  }, [calendarios]);

  useEffect(() => {
    localStorage.setItem("notificaciones", JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    localStorage.setItem("eventos", JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem("calendariosSuscritos", JSON.stringify(calendariosSuscritos));
  }, [calendariosSuscritos]);


  // =======================================================
  // FUNCION GLOBAL PARA CERRAR SESION
  // =======================================================

  // --- LogOut y borrado de todos los datos locales ---
    const cerrarSesion = async () => {
      try {
        localStorage.setItem("logueado", "false");
        setUsuario(null);
        setCalendarios([]);
        setNotificaciones([]);
        setEventos([]);
        setCalendariosSuscritos([]);
        await logOut();
        // Aquí podríamos limpiar otros datos locales si es necesario
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

  // =======================================================
  // FUNCIONES GLOBAL PARA CALENDARIOS
  // =======================================================
  async function crearCalendarioGlobal(datos: CalendarioCrear): Promise<boolean> {
    if (!usuario?._id) return false;

    const ok = await crearCalendario(datos, usuario._id);

    if (ok) {
      const nuevos = await listarCalendariosPropios(usuario._id);
      setCalendarios(nuevos);
    }

    return ok;
  }


  async function editarCalendarioGlobal(id: string, datos: CalendarioModificar): Promise<boolean> {
    const ok = await editarCalendario(id, datos);

    if (ok && usuario?._id) {
      const nuevos = await listarCalendariosPropios(usuario._id);
      setCalendarios(nuevos);
    }

    return ok;
  }


  async function eliminarCalendarioGlobal(id: string): Promise<boolean> {
    const ok = await eliminarCalendario(id);

    if (ok && usuario?._id) {
      const nuevos = await listarCalendariosPropios(usuario._id);
      setCalendarios(nuevos);
    }

    return ok;
  }


  // =======================================================
  // SUSCRIPCIONES
  // =======================================================
  async function suscribirseGlobal(calendarioId: string): Promise<boolean> {
    if (!usuario?._id) return false;

    const ok = await suscribirseACalendario(usuario._id, calendarioId);
    if (!ok) return false;

    const propios = await listarCalendariosPropios(usuario._id);
    setCalendarios(propios);

    const subs = await listarCalendariosSuscritos(usuario._id);
    setCalendariosSuscritos(subs);

    return true;
  }

  async function desuscribirseGlobal(calendarioId: string): Promise<boolean> {
    if (!usuario?._id) return false;

    const ok = await desuscribirseDeCalendario(usuario._id, calendarioId);
    if (!ok) return false;

    const subs = await listarCalendariosSuscritos(usuario._id);
    setCalendariosSuscritos(subs);

    return true;
  }


  // =======================================================
  // RECARGAR TODOS LOS CALENDARIOS
  // =======================================================
  async function recargarCalendarios() {
    if (!usuario?._id) {
      setCalendarios([]);
      setCalendariosSuscritos([]);
      return;
    }

    const propios = await listarCalendariosPropios(usuario._id);
    setCalendarios(propios);

    try {
      const subs = await listarCalendariosSuscritos(usuario._id);
      setCalendariosSuscritos(subs);
    } catch {
      setCalendariosSuscritos([]);
    }
  }

  // 1. Obtenemos el usuario de autenticación
  const { user: firebaseUser, logOut } = useAuth();

  // Añadir en la parte de estados
  const [usuarioLoading, setUsuarioLoading] = useState<boolean>(true);

  // En el efecto que carga datos automáticos:
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      setUsuarioLoading(true);
      if (!firebaseUser) {
        setUsuario(null);
        setCalendarios([]);
        setCalendariosSuscritos([]);
        setNotificaciones([]);
        setUsuarioLoading(false);
        return;
      }
      try {
        const tokenGuardado = localStorage.getItem("provider_token"); 
        const datosLogin = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          alias: firebaseUser.displayName,
          foto: firebaseUser.photoURL,
          provider_token: tokenGuardado || null
        };
        const usuarioMongo = await sincronizarUsuario(datosLogin);
        if (usuarioMongo) {
          setUsuario(usuarioMongo);
          const [misCals, susCals, misNotifs] = await Promise.all([
            listarCalendariosPropios(usuarioMongo._id),
            listarCalendariosSuscritos(usuarioMongo._id),
            listarNotificaciones(usuarioMongo._id)
          ]);
          setCalendarios(misCals);
          setCalendariosSuscritos(susCals);
          setNotificaciones(misNotifs);
        }
      } catch (error) {
        console.error("Error cargando datos automáticos:", error);
      } finally {
        setUsuarioLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [firebaseUser]);

  // =======================================================
  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        calendarios,
        calendariosSuscritos,
        eventos,
        notificaciones,
        usuarioLoading,

        actualizarUsuario,
        setUsuario,
        setCalendarios,
        setCalendariosSuscritos,
        setEventos,
        setNotificaciones,

        cerrarSesion,
        recargarCalendarios,
        crearCalendarioGlobal,
        editarCalendarioGlobal,
        eliminarCalendarioGlobal,
        suscribirseGlobal,
        desuscribirseGlobal
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};


// =======================================================
// HOOK
// =======================================================
export const useUsuario = () => {
  const ctx = useContext(UsuarioContext);
  if (!ctx) throw new Error("useUsuario debe usarse dentro de UsuarioProvider");
  return ctx;
};
