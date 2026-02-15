// ====================================================================
// ======================== Usuarios ==================================
// ====================================================================

//Para representar un usuario básico, pendiente de modificar
export interface UsuarioRespuesta {
  _id: string;                // equivale al alias en Pydantic
  alias: string;
  email: string;
  foto: string;
  recibirNotificaciones: boolean; 
  calendariosCreados: string[];
  calendariosSuscritos: string[];
  provider_token?: string | null;
}

export interface UsuarioActualizar {
  alias?: string;
  email?: string;
  foto?: string;
  recibirNotificaciones?: boolean;
  provider_token?: string | null;
}

export interface UsuarioLoginDTO {
    id: string; // El UID de Firebase
    email: string;
    alias?: string | null;
    foto?: string | null;
    provider_token?: string | null;
}

// ====================================================================
// ======================== Etiquetas =================================
// ====================================================================
//Para representar una etiqueta
export interface EtiquetaDTO {
  etiquetaId: string;
  etiqueta: string;
  color: string;
}

//Para representar un contador de etiquetas de los eventos
export interface Contador {
  etiqueta: EtiquetaDTO;
  contador: number;
}


// ====================================================================
// ======================== Comentarios ===============================
// ====================================================================

// Para enviar un comentario
export interface ComentarioCrear {
  texto: string;
  usuarioId: string;
  eventoId: string;
  usuarioAlias: string;
}

// Para modificar un comentario
export interface ComentarioModificar {
  texto: string;
}

// Respuesta completa
export interface ComentarioRespuesta {
    _id: string;
    texto: string;
    usuarioId: string;
    fechaCreacion: string;
    eventoId: string;
    usuarioAlias: string;
}


// ====================================================================
// ======================== Eventos ===================================
// ====================================================================

// Crear evento
export interface EventoCrear {
  titulo: string;
  descripcion: string;
  fechaComienzo: string;
  fechaFinal: string;
  lugar: string;
  etiqueta?: EtiquetaDTO | null;
  calendarioId: string;
  usuarioId: string;
  latitud?: number | null;
  longitud?: number | null;
  multimedia?: string[];
}

// Modificar evento
export interface EventoModificar {
  titulo?: string;
  descripcion?: string;
  fechaComienzo?: string;
  fechaFinal?: string;
  lugar?: string;
  etiqueta?: EtiquetaDTO | null;
  calendarioIdNuevo?: string;
  latitud?: number | null;
  longitud?: number | null;
  multimedia?: string[];
}

// Respuesta evento
export interface EventoRespuesta {
  _id: string;              // alias de id en Python
  titulo: string;
  descripcion: string;
  fechaCreacion: string;    // datetime → string ISO
  fechaComienzo: string;    // datetime → string ISO
  fechaFinal: string;       // datetime → string ISO
  lugar: string;
  etiqueta?: EtiquetaDTO | null; // opcional
  calendarioId: string;
  usuarioId: string;
  latitud?: number | null;
  longitud?: number | null;
  multimedia?: string[];
}

// Evento + comentarios
export interface EventoDTO {
    evento: EventoRespuesta;
    comentarios: ComentarioRespuesta[];
} 


// ====================================================================
// ======================== Calendarios ===============================
// ====================================================================
//Lista de IDs de calendarios
export interface ListaIds {
  ids: string[];
}

// Crear calendario
export interface CalendarioCrear {
  titulo: string;
  descripcion: string;
  portada?: string; // Omitimos | null aquí, ya que el valor se establecerá como string si falta
  publico?: boolean; 
  calendarioPadre?: string | null;
}


// Evento simplificado dentro de un calendario
export interface EventoReducido {
  _id: string;
  titulo?: string;  
  fechaComienzo?: string;
  fechaFinal?: string;
  etiqueta?: EtiquetaDTO;
  lugar?: string;
  descripcion?: string;
}


// Modificar calendario
export interface CalendarioModificar {
  titulo?: string;
  portada?: string;
  descripcion?: string;
  publico?: boolean;
  calendarioPadre?: string | null;
}


// Calendario de respuesta desde Mongo
export interface CalendarioRespuesta {
  _id: string;            
  titulo: string;
  portada: string;
  descripcion: string;
  publico: boolean;
  fechaCreacion: string;  
  usuarioId: string;
  calendarioPadre?: string | null;
  eventos: EventoReducido[];
  subcalendarios: string[];
}


// Calendario + subcalendarios expandidos
export interface CalendarioDTO {
  _id: string;                 
  titulo: string;
  portada?: string | null;
  descripcion: string;
  publico: boolean;
  fechaCreacion: string;      // datetime → string en JSON
  usuarioId: string;
  calendarioPadre?: string | null;

  eventos: EventoReducido[];

  // subcalendarios es un array de otros calendarios completos
  subcalendarios: CalendarioRespuesta[];
}

// ====================================================================
// ===================== Notificaciones ===============================
// ====================================================================

// Crear notificación
export interface NotificacionCrear {
  usuarioId: string;
  leido?: boolean;  // default False
  comentario: string;
  comentarioUsuario: string;
  evento: string;
}

export interface NotificacionRespuesta {
    _id: string;                 // _id convertido a string por el backend
    usuarioId: string;
    leido: boolean;
    comentario: string;
    comentarioUsuario: string;
    evento: string;
}