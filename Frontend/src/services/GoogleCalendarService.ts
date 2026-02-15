import { CalendarioCrear, EtiquetaDTO } from "../schemas/KalendasSchemas";
import { importarCalendario } from "./KalendasService";

import imagenBaseCalendario from "../imagenes/imagenBaseCalendario.png";

const API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;

function filtrarEventosPorFecha(
  items: any[],
  desde: Date,
  hasta: Date
) {
  return items.filter(ev => {
    const inicioStr = ev.start?.dateTime ?? ev.start?.date;
    if (!inicioStr) return false;

    const inicio = new Date(inicioStr);
    return inicio >= desde && inicio <= hasta;
  });
}

export async function importarCalendarioGooglePublico(
  calendarIdGoogle: string,
  usuarioId: string
): Promise<{ ok: boolean; mensaje?: string }> {
  try {
    // 1️⃣ Llamar a Google
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarIdGoogle
    )}/events?key=${API_KEY}`;

    const resp = await fetch(url);

    if (!resp.ok) {
      const err = await resp.json();
      console.error("Google API error:", err);
      return { ok: false, mensaje: "Error obteniendo calendario de Google" };
    }

    const googleData = await resp.json();

    // 2️⃣ Filtrar eventos (hoy → +1 año)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dentroDeUnAnio = new Date();
    dentroDeUnAnio.setFullYear(dentroDeUnAnio.getFullYear() + 1);

    const eventosFiltrados = filtrarEventosPorFecha(
      googleData.items ?? [],
      hoy,
      dentroDeUnAnio
    );

    // 3️⃣ Sustituir items por los filtrados
    const googleDataFiltrado = {
      ...googleData,
      items: eventosFiltrados
    };

    // 2️⃣ Mapear a Kalendas
    const calendarioKalendas = mapGoogleCalendarToKalendas(
      googleDataFiltrado,
      usuarioId
    );

    // 3️⃣ Enviar al backend
    return await importarCalendario(usuarioId, calendarioKalendas);

  } catch (error) {
    console.error("Error importando calendario Google:", error);
    return { ok: false, mensaje: "Error inesperado importando calendario" };
  }
}


export function mapGoogleCalendarToKalendas(
  googleData: any,
  usuarioId: string
): {
  titulo: string;
  descripcion: string;
  publico: boolean;
  portada: string;
  calendarioPadre: null;
  usuarioId: string;
  eventos: {
    titulo: string;
    descripcion: string;
    fechaCreacion: string;
    fechaComienzo: string;
    fechaFinal: string;
    lugar: string;
    etiqueta: null;
    latitud: null;
    longitud: null;
    multimedia: string[];
    usuarioId: string;
  }[];
  subcalendarios: [];
} {
  const eventos = googleData.items.map((ev: any) => {
    const inicio = ev.start?.dateTime ?? ev.start?.date;
    const fin = ev.end?.dateTime ?? ev.end?.date;

    return {
      titulo: ev.summary ?? "Sin título",
      descripcion: ev.description ?? "",
      fechaCreacion: new Date().toISOString(),
      fechaComienzo: inicio,
      fechaFinal: fin,
      lugar: ev.location ?? "",
      etiqueta: {
        "etiquetaId": "60a9b5f9c8d3a1f4b0e8d0a3",
        "etiqueta": "Ocio", 
        "color": "#1E90FF" 
      } as EtiquetaDTO,
      latitud: null,
      longitud: null,
      multimedia: [],
      usuarioId: usuarioId
    };
  });

  return {
    titulo: googleData.summary ?? "Calendario de Google",
    descripcion:
      googleData.description ?? "Calendario importado desde Google Calendar",
    publico: false,
    portada: imagenBaseCalendario,//"/static/media/imagenBaseCalendario.060aea1d811f882e86c5.png",
    calendarioPadre: null,
    usuarioId: usuarioId,
    eventos: eventos,
    subcalendarios: []
  };
}



// 1. Obtener lista de calendarios del usuario
export async function listarCalendariosGoogle(token: string) {
    const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al listar calendarios de Google");
    const data = await response.json();
    return data.items || []; 
}

// 2. Importar un calendario privado usando el Token
export async function importarCalendarioGooglePrivado(
  calendarIdGoogle: string,
  usuarioId: string,
  token: string
): Promise<{ ok: boolean; mensaje?: string }> {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarIdGoogle
    )}/events`;

    const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      return { ok: false, mensaje: "No tienes permiso o el token ha expirado" };
    }

    const googleData = await resp.json();

    // Reutilizamos tu lógica de filtrado existente (asumiendo que las funciones auxiliares están en este archivo)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dentroDeUnAnio = new Date();
    dentroDeUnAnio.setFullYear(dentroDeUnAnio.getFullYear() + 1);

    // Nota: Asegúrate de que filtrarEventosPorFecha esté accesible o cópiala aquí
    const eventosFiltrados = filtrarEventosPorFecha(
      googleData.items ?? [],
      hoy,
      dentroDeUnAnio
    );

    const googleDataParaMapear = {
      summary: googleData.summary || "Calendario Importado", 
      description: googleData.description,
      ...googleData,
      items: eventosFiltrados
    };

    const calendarioKalendas = mapGoogleCalendarToKalendas(
      googleDataParaMapear,
      usuarioId
    );

    return await importarCalendario(usuarioId, calendarioKalendas);

  } catch (error) {
    console.error("Error importando:", error);
    return { ok: false, mensaje: "Error inesperado" };
  }
}


