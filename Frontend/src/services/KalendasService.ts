import {
    CalendarioDTO,
    CalendarioCrear,
    CalendarioModificar,
    EventoDTO,
    EventoModificar,
    NotificacionRespuesta,
    EventoCrear,
    ComentarioRespuesta,
    ComentarioCrear,
    ComentarioModificar,
    EtiquetaDTO,
    UsuarioRespuesta,
    NotificacionCrear,
    UsuarioActualizar,
    EventoRespuesta,
    UsuarioLoginDTO
} from "../schemas/KalendasSchemas";

const KALENDAS_API = process.env.REACT_APP_KALENDAS_API!;


//==================================================
// CRUD CALENDARIOS
//==================================================

//Listar calendarios públicos

export async function listarCalendariosPublicos(): Promise<CalendarioDTO[]> {
    const response = await fetch(`${KALENDAS_API}/calendarios/listarPublicos/`);
    if (!response.ok) throw new Error("Error al obtener los calendarios públicos");
    return response.json();
}

// Listar calendarios propios
export async function listarCalendariosPropios(usuarioId: string): Promise<CalendarioDTO[]> {
    const response = await fetch(`${KALENDAS_API}/calendarios/${usuarioId}`);
    if (!response.ok) throw new Error("Error al obtener los calendarios propios");
    return response.json();
}


// Crear calendario
export async function crearCalendario(
    datos: CalendarioCrear,
    usuarioId: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/calendarios/${usuarioId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }
        );
        return response.ok;
    } catch (err) {
        console.error("Error al crear calendario:", err);
        return false;
    }
}


// Editar calendario
export async function editarCalendario(
    calendarioId: string,
    datos: CalendarioModificar
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/calendarios/${calendarioId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }
        );
        return response.ok;
    } catch (err) {
        console.error("Error al editar calendario:", err);
        return false;
    }
}


// Eliminar calendario
export async function eliminarCalendario(calendarioId: string): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/calendarios/${calendarioId}`,
            { method: "DELETE" }
        );
        return response.ok;
    } catch (err) {
        console.error("Error al eliminar calendario:", err);
        return false;
    }
}

// Obtener calendario por ID
export async function obtenerCalendarioPorId(id: string): Promise<CalendarioDTO | null> {
  try {
    const url = `${KALENDAS_API}/calendarios/obtener/${id}`;
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include"
    });

    if (!resp.ok) {
      console.error("Error al obtener el calendario:", resp.status);
      return null;
    }

    const data = await resp.json();
    return data as CalendarioDTO;

  } catch (error) {
    console.error("Error al obtener calendario por ID:", error);
    return null;
  }
}


//==================================================
// CRUD DE SUBCALENDARIOS
//==================================================

//Agregar subcalendario a calendario


// Eliminar subcalendario de calendario

//==================================================
// CRUD DE EVENTOS
//==================================================

//Obtener un evento por su ID
export async function obtenerEventoPorId(eventoId: string): Promise<EventoDTO> {
  const response = await fetch(`${KALENDAS_API}/eventos/${eventoId}`);
  if (!response.ok) {
    throw new Error("Error al obtener el evento completo");
  }
  return response.json();
}


// Editar un evento
export async function editarEvento(
    eventoId: string,
    datos: EventoModificar
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/eventos/${eventoId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }
        );

        return response.ok;

    } catch (err) {
        console.error("Error al editar evento:", err);
        return false;
    }
}


//Eliminar un evento
export async function eliminarEvento(eventoId: string){
  try{
    const response = await fetch(
      `${KALENDAS_API}/eventos/${eventoId}`,
      { method: "DELETE" }
    );
     return response.ok;
  } catch (err) {
    console.error("Error al eliminar evento:", err);
    return false;
  }
}


//Crear evento
export async function crearEvento(datos: EventoCrear): Promise<EventoDTO | null> {
    try {
      console.log("Creando evento con datos:", datos); // LOG DE DEBUG
        const response = await fetch(
            `${KALENDAS_API}/eventos/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }
        );

        if (!response.ok) {
            console.error("Error backend al crear evento");
            return null;
        }

        const eventoCreado = await response.json();
        return eventoCreado as EventoDTO;

    } catch (err) {
        console.error("Error de conexión al crear evento:", err);
        return null;
    }
}

    // === Obtener eventos completos desde el gateway ===
    export async function obtenerEventosDeUnCalendario(id: string): Promise<EventoRespuesta[]> {
        const url = `${KALENDAS_API}/eventos/calendario/?calendarioId=${id}`;
        const resp = await fetch(url);
        if (!resp.ok) return [];
        return await resp.json();
}

    // Importar calendario
    export async function importarCalendario(
        usuarioId: string,
        calendarioJson: any
    ): Promise<{ ok: boolean; mensaje?: string }> {
        try {
            const response = await fetch(
                `${KALENDAS_API}/importar-calendario/${usuarioId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(calendarioJson)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                return { ok: false, mensaje: errorText };
            }

            return { ok: true };

        } catch (error) {
            console.error("Error importando calendario:", error);
            return { ok: false, mensaje: "Error de conexión con el servidor" };
        }
    }

//==================================================
// CRUD DE COMENTARIOS
//==================================================

//Filtrar comentarios por id de evento
export async function obtenerComentarioPorId(
  id: string
): Promise<ComentarioRespuesta> {
  const response = await fetch(
    `${KALENDAS_API}/comentarios/${id}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener el comentario");
  }

  return response.json();
}

//Modificar comentario
export async function modificarComentario(
  comentarioId: string,
  datos: ComentarioModificar
): Promise<boolean> {
  try {
    const response = await fetch(
      `${KALENDAS_API}/comentarios/${comentarioId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      }
    );

    return response.ok;

  } catch (err) {
    console.error("Error al modificar comentario:", err);
    return false;
  }
}

//Eliminar comentario
export async function eliminarComentario(
  comentarioId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${KALENDAS_API}/comentarios/${comentarioId}`,
      { method: "DELETE" }
    );

    return response.ok;

  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    return false;
  }
}

//Crear comentario
export async function crearComentario(
  datos: ComentarioCrear
): Promise<ComentarioRespuesta | null> {
  try {
    const response = await fetch(`${KALENDAS_API}/comentarios/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      console.error("Error backend al crear comentario");
      return null;
    }

    const comentario = await response.json();
    return comentario as ComentarioRespuesta;

  } catch (err) {
    console.error("Error al crear comentario:", err);
    return null;
  }
}


//==================================================
// CRUD DE ETIQUETAS
//==================================================

//Listar etiquetas

export async function listarEtiquetas(): Promise<EtiquetaDTO[]> {
  const response = await fetch(`${KALENDAS_API}/etiquetas/`);
  if (!response.ok) throw new Error("Error al obtener las etiquetas");
  return response.json();
}

//==================================================
// CRUD DE NOTIFICACIONES
//==================================================
//Listar notificaciones por usuario
export async function listarNotificaciones(usuarioId: string): Promise<NotificacionRespuesta[]> {
  const response = await fetch(`${KALENDAS_API}/notificaciones/${usuarioId}`);
  if (!response.ok) throw new Error("Error al obtener las notificaciones");
  return response.json();
}

// Cambiar estado leído de una notificación
export async function cambiarEstadoLeido(
    notificacionId: string,
    leido: boolean
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/notificaciones/cambiar_estado_leido/${notificacionId}/${leido}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            console.error("Error backend al cambiar estado leído");
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error de conexión al backend:", err);
        return false;
    }
}


// Marcar todas las notificaciones de un usuario como leídas
export async function marcarTodasNotificacionesLeidas(usuarioId: string): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/notificaciones/marcar_todas_leidas/${usuarioId}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            console.error("Error al marcar todas como leídas en backend");
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error conectando al backend al marcar todas:", err);
        return false;
    }
}


//Eliminar una notificación por ID
export async function eliminarNotificacion(notificacionId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${KALENDAS_API}/notificaciones/${notificacionId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      console.error("Error al eliminar la notificación");
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error conectando al backend al eliminar:", err);
    return false;
  }
}


//Eliminar varias notificaciones por IDs
export async function eliminarNotificacionesPorIds(notificacionIds: string[]): Promise<boolean> {
    try {
        const queryString = notificacionIds
            .map(id => `ids=${encodeURIComponent(id)}`)
            .join("&");

        const response = await fetch(`${KALENDAS_API}/notificaciones/?${queryString}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Error al eliminar varias notificaciones");
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error conectando al backend al eliminar varias notificaciones:", err);
        return false;
    }
}


// Crear notificación
export async function crearNotificacion(data: NotificacionCrear): Promise<NotificacionRespuesta> {
  const response = await fetch(`${KALENDAS_API}/notificaciones/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear la notificación");
  }

  return response.json();
}

//==================================================
// CRUD DE USUARIOS
//==================================================

// Sincronizar usuario (Login/Registro con Firebase)
export async function sincronizarUsuario(datos: UsuarioLoginDTO): Promise<UsuarioRespuesta | null> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/usuarios/sincronizar/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            }
        );

        if (!response.ok) {
            console.error("Error al sincronizar usuario con el backend");
            return null;
        }

        // Devuelve el usuario completo (con calendarios, etc.)
        return await response.json();

    } catch (err) {
        console.error("Error de conexión al sincronizar usuario:", err);
        return null;
    }
}

// suscribirse a calendario
export async function suscribirseACalendario(
    usuarioId: string,
    calendarioId: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/usuarios/${usuarioId}/suscribir/${calendarioId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.ok;

    } catch (err) {
        console.error("Error al suscribirse al calendario:", err);
        return false;
    }
}

// Desuscribirse de calendario
export async function desuscribirseDeCalendario(
    usuarioId: string,
    calendarioId: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${KALENDAS_API}/usuarios/${usuarioId}/desuscribir/${calendarioId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.ok;

    } catch (err) {
        console.error("Error al desuscribirse del calendario:", err);
        return false;
    }
}

// Listar calendarios suscritos de un usuario
export async function listarCalendariosSuscritos(usuarioId: string): Promise<CalendarioDTO[]> {
    const response = await fetch(
        `${KALENDAS_API}/usuarios/${usuarioId}/calendariosSuscritos/`
    );

    if (!response.ok) {
        throw new Error("Error al obtener los calendarios suscritos");
    }

    return response.json();
}



// Editar usuario
export async function editarUsuario(
  usuarioId: string,
  datos: UsuarioActualizar
): Promise<UsuarioRespuesta> {
  try {
    const response = await fetch(
      `${KALENDAS_API}/usuarios/${usuarioId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      throw new Error("Error al editar usuario");
    }

    return await response.json();

  } catch (err) {
    console.error("Error al editar usuario:", err);
    throw err;
  }
}

// Obtener usuario por ID
export async function obtenerUsuarioPorId(usuarioId: string): Promise<UsuarioRespuesta> {
  const response = await fetch(`${KALENDAS_API}/usuarios/${usuarioId}`);

  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }

  return response.json();
}




//==================================================
// OTROS
//==================================================

export async function obtenerTokenProvider(uid: string): Promise<string | null> {
    try {
        const response = await fetch(`${KALENDAS_API}/token?uid=${uid}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.token || null;
    } catch (error) {
        console.error("Error obteniendo token:", error);
        return null;
    }
}