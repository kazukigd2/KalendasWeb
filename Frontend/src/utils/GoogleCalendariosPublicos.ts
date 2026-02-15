export interface GooglePublicCalendar {
  id: string;
  titulo: string;
  descripcion: string;
}

export const GOOGLE_PUBLIC_CALENDARS: GooglePublicCalendar[] = [

  // ==================== FESTIVOS ====================
  {
    id: "es.spain#holiday@group.v.calendar.google.com",
    titulo: "Festivos de España",
    descripcion: "Festivos nacionales oficiales de España"
  },
  {
    id: "en.uk#holiday@group.v.calendar.google.com",
    titulo: "Festivos del Reino Unido",
    descripcion: "Festivos oficiales y bank holidays del Reino Unido"
  },
  {
    id: "en.usa#holiday@group.v.calendar.google.com",
    titulo: "Festivos de Estados Unidos",
    descripcion: "Festivos federales oficiales de EE.UU."
  },
  {
    id: "fr.french#holiday@group.v.calendar.google.com",
    titulo: "Festivos de Francia",
    descripcion: "Festivos nacionales oficiales de Francia"
  },
  {
    id: "de.german#holiday@group.v.calendar.google.com",
    titulo: "Festivos de Alemania",
    descripcion: "Festivos nacionales oficiales de Alemania"
  },
  {
    id: "it.italian#holiday@group.v.calendar.google.com",
    titulo: "Festivos de Italia",
    descripcion: "Festivos nacionales oficiales de Italia"
  },
  {
    id: "pt.portuguese#holiday@group.v.calendar.google.com",
    titulo: "Festivos de Portugal",
    descripcion: "Festivos nacionales oficiales de Portugal"
  },

  // ==================== RELIGIÓN ====================
  {
    id: "en.christian#holiday@group.v.calendar.google.com",
    titulo: "Festividades cristianas",
    descripcion: "Principales celebraciones del calendario cristiano"
  },
  {
    id: "en.hindu#holiday@group.v.calendar.google.com",
    titulo: "Festividades hindúes",
    descripcion: "Principales celebraciones del calendario hindú"
  },
];
