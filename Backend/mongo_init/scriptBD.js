db = db.getSiblingDB('Kalendas');

db.calendario.insertMany([
    {
        _id: ObjectId("690b77e2aa12bc71b827a777"),
        titulo: "Viaje a Japón 2026",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703562/ez0hl4yl7jt6xbtcqlw7.jpg",
        descripcion: "Calendario para organizar el viaje a Japón en primavera de 2026.",
        publico: false,
        fechaCreacion: new Date("2025-11-25T12:00:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: null,
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737201",
                titulo: "Compra de billetes de avión",
                fechaComienzo: new Date("2026-02-10T10:00:00"),
                fechaFinal: new Date("2026-02-10T11:00:00"),
                lugar: "Online",
                descripcion: "Comprar los billetes de ida y vuelta a Tokio.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1",
                    etiqueta: "Importante",
                    color: "#FFA500"
                },
                latitud: 35.6764,
                longitud: 139.6500
            },
            {
                id: "66fa1a01fee6ad04b5737202",
                titulo: "Reserva de hoteles",
                fechaComienzo: new Date("2026-02-15T18:00:00"),
                fechaFinal: new Date("2026-02-15T20:00:00"),
                lugar: "Online",
                descripcion: "Buscar y reservar hoteles en Tokio y Kioto.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6",
                    etiqueta: "Revision",
                    color: "#FF69B4"
                },
                latitud: 35.6895,
                longitud: 139.6917
            }
        ],
        subcalendarios: [
            "690b781b1fa1bc71b827a778",
            "690b78591fa1bc71b827a779"
        ]
    },
    {
        _id: ObjectId("690b781b1fa1bc71b827a778"),
        titulo: "Tokio",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703562/iensobf4cnechp6adxdo.jpg",
        descripcion: "Planificación de actividades en Tokio.",
        publico: false,
        fechaCreacion: new Date("2025-11-25T12:05:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: "690b77e2aa12bc71b827a777",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737203",
                titulo: "Visita a Akihabara",
                fechaComienzo: new Date("2026-03-05T11:00:00"),
                fechaFinal: new Date("2026-03-05T15:00:00"),
                lugar: "Akihabara, Tokio",
                descripcion: "Recorrido por la zona tecnológica y de videojuegos.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3",
                    etiqueta: "Ocio",
                    color: "#1E90FF"
                },
                latitud: 35.6984,
                longitud: 139.7730
            },
            {
                id: "66fa1a01fee6ad04b5737204",
                titulo: "Tarde en Shibuya",
                fechaComienzo: new Date("2026-03-06T17:00:00"),
                fechaFinal: new Date("2026-03-06T21:00:00"),
                lugar: "Shibuya, Tokio",
                descripcion: "Visitar el cruce de Shibuya y sus alrededores.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3",
                    etiqueta: "Ocio",
                    color: "#1E90FF"
                },
                latitud: 35.6595,
                longitud: 139.7005
            }
        ],
        subcalendarios: []
    },
    {
        _id: ObjectId("690b78591fa1bc71b827a779"),
        titulo: "Kioto",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703562/mapd4ht29mb6r4akuhpw.jpg",
        descripcion: "Planificación de actividades en Kioto.",
        publico: false,
        fechaCreacion: new Date("2025-11-25T12:07:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: "690b77e2aa12bc71b827a777",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737205",
                titulo: "Visita a Fushimi Inari",
                fechaComienzo: new Date("2026-03-10T09:00:00"),
                fechaFinal: new Date("2026-03-10T12:00:00"),
                lugar: "Fushimi Inari, Kioto",
                descripcion: "Recorrido por los miles de toriis del santuario.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a2",
                    etiqueta: "Familiar",
                    color: "#008000"
                },
                latitud: 34.9671,
                longitud: 135.7727
            },
            {
                id: "66fa1a01fee6ad04b5737206",
                titulo: "Paseo por el Bosque de Bambú",
                fechaComienzo: new Date("2026-03-11T10:00:00"),
                fechaFinal: new Date("2026-03-11T13:00:00"),
                lugar: "Arashiyama, Kioto",
                descripcion: "Caminata por el famoso bosque de Arashiyama.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3",
                    etiqueta: "Ocio",
                    color: "#1E90FF"
                },
                latitud: 35.0094,
                longitud: 135.6668
            }
        ],

        subcalendarios: []
    },
    {
        _id: ObjectId("69088a48fee6ad04b573713f"),
        titulo: "Vacaciones de Navidad",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703562/oobiuktfpqr9fl5cj2oq.jpg",
        descripcion: "Calendario para organizar las vacaciones de navidad.",
        publico: false,
        fechaCreacion: new Date("2025-11-03T10:56:08.081000"),
        usuarioId: "71aa1a01fee6ad04b5737002",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737101",
                titulo: "Preparar maletas",
                fechaComienzo: new Date("2025-12-20T09:00:00"),
                fechaFinal: new Date("2025-12-20T11:00:00"),
                lugar: "Casa",
                descripcion: "Empacar ropa y regalos antes del viaje.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1", etiqueta: "Importante", color: "#FFA500" },
                latitud: 36.7213, longitud: -4.4216
            },
            {
                id: "66fa1a01fee6ad04b5737102",
                titulo: "Cena de Navidad",
                fechaComienzo: new Date("2025-12-24T20:00:00"),
                fechaFinal: new Date("2025-12-25T01:00:00"),
                lugar: "Casa de los abuelos",
                descripcion: "Cena familiar tradicional.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a2", etiqueta: "Familiar", color: "#008000" },
                latitud: 36.7320, longitud: -4.4663
            },
            {
                id: "66fa1a01fee6ad04b5737103",
                titulo: "Viaje a Sierra Nevada",
                fechaComienzo: new Date("2025-12-27T08:00:00"),
                fechaFinal: new Date("2026-01-02T20:00:00"),
                lugar: "Granada",
                descripcion: "Vacaciones de esquí con amigos.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3", etiqueta: "Ocio", color: "#1E90FF" },
                latitud: 37.0914, longitud: -3.3976
            }
        ],
        calendarioPadre: null,
        subcalendarios: []
    },
    {
        _id: ObjectId("69088c5dfee6ad04b5737140"),
        titulo: "Universidad",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/oq4xldzcbyrfrurxkooz.jpg",
        descripcion: "Calendario para organizar las asignaturas de la universidad.",
        publico: true,
        fechaCreacion: new Date("2025-11-03T11:05:01.291000"),
        usuarioId: "71aa1a01fee6ad04b5737003",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737104",
                titulo: "Examen de Bases de Datos",
                fechaComienzo: new Date("2025-11-10T09:30:00"),
                fechaFinal: new Date("2025-11-10T11:30:00"),
                lugar: "UMA",
                descripcion: "Examen final de la asignatura.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a4", etiqueta: "Urgente", color: "#FF0000" },
                latitud: 36.7157, longitud: -4.4777
            },
            {
                id: "66fa1a01fee6ad04b5737105",
                titulo: "Entrega de proyecto de IA",
                fechaComienzo: new Date("2025-11-15T18:00:00"),
                fechaFinal: new Date("2025-11-15T19:00:00"),
                lugar: "Campus Virtual",
                descripcion: "Subir el proyecto final a la plataforma.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1", etiqueta: "Importante", color: "#FFA500" },
                latitud: 36.7190, longitud: -4.4200
            },
            {
                id: "66fa1a01fee6ad04b5737106",
                titulo: "Tutoría con el profesor de Programacion",
                fechaComienzo: new Date("2025-11-05T11:00:00"),
                fechaFinal: new Date("2025-11-05T11:30:00"),
                lugar: "Despacho 2.15",
                descripcion: "Resolver dudas del parcial.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a5", etiqueta: "Académico", color: "#4682B4" },
                latitud: 36.7159, longitud: -4.4737
            },
            {
                id: "66fa1a01fee6ad04b5737110",
                titulo: "Presentación del TFG",
                fechaComienzo: new Date("2025-12-02T10:00:00"),
                fechaFinal: new Date("2025-12-02T11:00:00"),
                lugar: "Aula Magna",
                descripcion: "Defensa ante el tribunal.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0b0", etiqueta: "Final", color: "#800080" },
                latitud: 36.7150, longitud: -4.4700
            }
        ],
        calendarioPadre: null,
        subcalendarios: []
    },
    {
        _id: ObjectId("69088c8dfee6ad04b5737141"),
        titulo: "Rugby",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/ussrs7dfbawxeuumma2b.jpg",
        descripcion: "Calendario para organizar mis clases de rugby.",
        publico: false,
        fechaCreacion: new Date("2025-11-03T11:05:49.784000"),
        usuarioId: "71aa1a01fee6ad04b5737002",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737107",
                titulo: "Entrenamiento físico",
                fechaComienzo: new Date("2025-11-04T18:00:00"),
                fechaFinal: new Date("2025-11-04T19:30:00"),
                lugar: "Gimnasio municipal",
                descripcion: "Sesión de cardio y resistencia.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a7", etiqueta: "Entrenamiento", color: "#00CED1" },
                latitud: 36.7250, longitud: -4.4420
            },
            {
                id: "66fa1a01fee6ad04b5737108",
                titulo: "Partido amistoso",
                fechaComienzo: new Date("2025-11-08T17:00:00"),
                fechaFinal: new Date("2025-11-08T19:00:00"),
                lugar: "Campo de Rugby de Teatinos",
                descripcion: "Partido entre equipos locales.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a8", etiqueta: "Competición", color: "#32CD32" },
                latitud: 36.7200, longitud: -4.4500
            },
            {
                id: "66fa1a01fee6ad04b5737109",
                titulo: "Charla motivacional del club",
                fechaComienzo: new Date("2025-11-06T20:00:00"),
                fechaFinal: new Date("2025-11-06T21:00:00"),
                lugar: "Sala del club",
                descripcion: "Sesión con exjugadores profesionales.",
                etiqueta: { etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a9", etiqueta: "Evento especial", color: "#FFD700" },
                latitud: 36.7260, longitud: -4.4450
            }
        ],
        calendarioPadre: null,
        subcalendarios: []
    },
    {
        _id: ObjectId("690a57be4b34bc71b827a216"),
        titulo: "Proyecto Indie Dev",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/zwza9hs41vg3hu9ncauc.jpg",
        descripcion: "Calendario para coordinar las tareas del proyecto de desarrollo indie con mi equipo.",
        publico: false,
        fechaCreacion: new Date("2025-11-04T19:45:02.866Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737111",
                titulo: "Kickoff del proyecto",
                fechaComienzo: new Date("2025-11-05T19:00:00"),
                fechaFinal: new Date("2025-11-05T20:30:00"),
                lugar: "Discord / Online",
                descripcion: "Reunión inicial para definir tareas, roles y objetivos.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1",
                    etiqueta: "Importante",
                    color: "#FFA500"
                },
                latitud: 36.7213,
                longitud: -4.4216
            },
            {
                id: "66fa1a01fee6ad04b5737112",
                titulo: "Revisión sprint 1",
                fechaComienzo: new Date("2025-11-12T19:00:00"),
                fechaFinal: new Date("2025-11-12T20:00:00"),
                lugar: "Discord / Online",
                descripcion: "Analizar avances del primer sprint.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6",
                    etiqueta: "Revision",
                    color: "#FF69B4"
                },
                latitud: 36.7213,
                longitud: -4.4216
            },
            {
                id: "66fa1a01fee6ad04b5737113",
                titulo: "Revisión milestones Q1",
                fechaComienzo: new Date("2025-11-19T19:00:00"),
                fechaFinal: new Date("2025-11-19T20:30:00"),
                lugar: "Discord / Online",
                descripcion: "Validar si los hitos del primer trimestre están completos.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0b0",
                    etiqueta: "Final",
                    color: "#800080"
                },
                latitud: 36.7213,
                longitud: -4.4216
            }
        ],
        subcalendarios: [
            "690a5bbcb1ce2e2d9f5b8145",
            "690a5c19b1ce2e2d9f5b8146"
        ],
        calendarioPadre: null
    },
    {
        _id: ObjectId("690a5bbcb1ce2e2d9f5b8145"),
        titulo: "Diseño de Personajes",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/ayv8iaiskgdsjh1ojobe.jpg",
        descripcion: "Subcalendario para organizar las fases de diseño de los personajes del juego indie.",
        publico: false,
        fechaCreacion: new Date("2025-11-04T20:02:04.507Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737114",
                titulo: "Bocetos del protagonista",
                fechaComienzo: new Date("2025-11-06T17:00:00"),
                fechaFinal: new Date("2025-11-06T19:00:00"),
                lugar: "Tablet / PC",
                descripcion: "Primera fase de diseño del personaje principal.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1",
                    etiqueta: "Importante",
                    color: "#FFA500"
                },
                latitud: 36.7213,
                longitud: -4.4216
            },
            {
                id: "66fa1a01fee6ad04b5737115",
                titulo: "Revisión de estilo de NPCs",
                fechaComienzo: new Date("2025-11-13T17:00:00"),
                fechaFinal: new Date("2025-11-13T18:30:00"),
                lugar: "Tablet / PC",
                descripcion: "Ajuste visual de NPCs para coherencia artística.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6",
                    etiqueta: "Revision",
                    color: "#FF69B4"
                },
                latitud: 36.7213,
                longitud: -4.4216
            }
        ],
        subcalendarios: [],
        calendarioPadre: "690a57be4b34bc71b827a216"
    },
    {
        _id: ObjectId("690a5c19b1ce2e2d9f5b8146"),
        titulo: "Musica y Sonido",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/rusegwmova9dyrirpqo0.jpg",
        descripcion: "Subcalendario para planificar la composición de la banda sonora y los efectos de sonido del proyecto.",
        publico: false,
        fechaCreacion: new Date("2025-11-04T20:03:37.003Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        eventos: [
            {
                id: "66fa1a01fee6ad04b5737116",
                titulo: "Lluvia de ideas de temas principales",
                fechaComienzo: new Date("2025-11-07T21:00:00"),
                fechaFinal: new Date("2025-11-07T22:30:00"),
                lugar: "Estudio casero",
                descripcion: "Brainstorming para melodías principales del juego.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3",
                    etiqueta: "Ocio",
                    color: "#1E90FF"
                },
                latitud: 36.7213,
                longitud: -4.4216
            },
            {
                id: "66fa1a01fee6ad04b5737117",
                titulo: "Grabación de maquetas",
                fechaComienzo: new Date("2025-11-14T21:00:00"),
                fechaFinal: new Date("2025-11-14T23:00:00"),
                lugar: "Estudio casero",
                descripcion: "Prototipos de temas y efectos iniciales.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6",
                    etiqueta: "Revision",
                    color: "#FF69B4"
                },
                latitud: 36.7213,
                longitud: -4.4216
            }
        ],
        subcalendarios: [],
        calendarioPadre: "690a57be4b34bc71b827a216"
    },
    {
        _id: ObjectId("790b77e2aa12bc71b827a900"),
        titulo: "Eventos Públicos 2026",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/g39nt57g7jwsyk3fhdpj.jpg",
        descripcion: "Calendario público para mostrar eventos importantes del año 2026.",
        publico: true,
        fechaCreacion: new Date("2025-11-29T12:00:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: null,
        eventos: [],
        subcalendarios: [
            "790b781b1fa1bc71b827a901",
            "790b78591fa1bc71b827a902"
        ]
    },
    {
        _id: ObjectId("790b781b1fa1bc71b827a901"),
        titulo: "Conciertos 2026",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/sgytnuhz0niairgxzyqx.jpg",
        descripcion: "Listado de conciertos públicos del año 2026.",
        publico: true,
        fechaCreacion: new Date("2025-11-29T12:05:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: "790b77e2aa12bc71b827a900",
        eventos: [
            {
                id: "76fa1a01fee6ad04b5739001",
                titulo: "Concierto Año Nuevo",
                fechaComienzo: new Date("2026-01-01T20:00:00"),
                fechaFinal: new Date("2026-01-01T23:00:00"),
                lugar: "Madrid",
                descripcion: "Concierto público de inicio de año.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3", // Ocio
                    etiqueta: "Ocio",
                    color: "#1E90FF"
                },
                latitud: 40.4168,
                longitud: -3.7038
            }
        ],
        subcalendarios: []
    },
    {
        _id: ObjectId("790b78591fa1bc71b827a902"),
        titulo: "Exposiciones 2026",
        portada: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764703561/bhemyn8auqzvstm6an5i.jpg",
        descripcion: "Eventos culturales y exposiciones abiertas al público.",
        publico: true,
        fechaCreacion: new Date("2025-11-29T12:07:00.000Z"),
        usuarioId: "71aa1a01fee6ad04b5737001",
        calendarioPadre: "790b77e2aa12bc71b827a900",
        eventos: [
            {
                id: "76fa1a01fee6ad04b5739002",
                titulo: "Expo Arte Moderno",
                fechaComienzo: new Date("2026-03-12T10:00:00"),
                fechaFinal: new Date("2026-03-12T18:00:00"),
                lugar: "Barcelona",
                descripcion: "Gran exposición pública de arte contemporáneo.",
                etiqueta: {
                    etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1", // Importante
                    etiqueta: "Importante",
                    color: "#FFA500"
                },
                latitud: 41.3874,
                longitud: 2.1686
            }
        ],
        subcalendarios: []
    },
]);




// =========================================================
// ============== COLECCIÓN EVENTO COMPLETA =================
// =========================================================

db.evento.insertMany([
    {
        _id: ObjectId("66fa1a01fee6ad04b5737201"),
        calendarioId: "690b77e2aa12bc71b827a777",
        titulo: "Compra de billetes de avión",
        descripcion: "Comprar los billetes de ida y vuelta a Tokio.",
        lugar: "Online",
        fechaComienzo: new Date("2026-02-10T10:00:00.000Z"),
        fechaFinal: new Date("2026-02-10T11:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:10:00.000Z"),
        etiqueta: { color: "#FFA500", etiqueta: "Importante", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 35.6764,
        longitud: 139.6500
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737202"),
        calendarioId: "690b77e2aa12bc71b827a777",
        titulo: "Reserva de hoteles",
        descripcion: "Buscar y reservar hoteles en Tokio y Kioto.",
        lugar: "Online",
        fechaComienzo: new Date("2026-02-15T18:00:00.000Z"),
        fechaFinal: new Date("2026-02-15T20:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:12:00.000Z"),
        etiqueta: { color: "#FF69B4", etiqueta: "Revision", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 35.6895,
        longitud: 139.6917
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737203"),
        calendarioId: "690b781b1fa1bc71b827a778",
        titulo: "Visita a Akihabara",
        descripcion: "Recorrido por la zona tecnológica y de videojuegos.",
        lugar: "Akihabara, Tokio",
        fechaComienzo: new Date("2026-03-05T11:00:00.000Z"),
        fechaFinal: new Date("2026-03-05T15:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:15:00.000Z"),
        etiqueta: { color: "#1E90FF", etiqueta: "Ocio", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 35.6984,
        longitud: 139.7730
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737204"),
        calendarioId: "690b781b1fa1bc71b827a778",
        titulo: "Tarde en Shibuya",
        descripcion: "Visitar el cruce de Shibuya y sus alrededores.",
        lugar: "Shibuya, Tokio",
        fechaComienzo: new Date("2026-03-06T17:00:00.000Z"),
        fechaFinal: new Date("2026-03-06T21:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:17:00.000Z"),
        etiqueta: { color: "#1E90FF", etiqueta: "Ocio", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 35.6595,
        longitud: 139.7005
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737205"),
        calendarioId: "690b78591fa1bc71b827a779",
        titulo: "Visita a Fushimi Inari",
        descripcion: "Recorrido por los miles de toriis del santuario.",
        lugar: "Fushimi Inari, Kioto",
        fechaComienzo: new Date("2026-03-10T09:00:00.000Z"),
        fechaFinal: new Date("2026-03-10T12:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:20:00.000Z"),
        etiqueta: { color: "#008000", etiqueta: "Familiar", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a2" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 34.9671,
        longitud: 135.7727
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737206"),
        calendarioId: "690b78591fa1bc71b827a779",
        titulo: "Paseo por el Bosque de Bambú",
        descripcion: "Caminata por el famoso bosque de Arashiyama.",
        lugar: "Arashiyama, Kioto",
        fechaComienzo: new Date("2026-03-11T10:00:00.000Z"),
        fechaFinal: new Date("2026-03-11T13:00:00.000Z"),
        fechaCreacion: new Date("2025-11-25T12:22:00.000Z"),
        etiqueta: { color: "#1E90FF", etiqueta: "Ocio", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 35.0094,
        longitud: 135.6668
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737111"),
        calendarioId: "690a57be4b34bc71b827a216",
        titulo: "Kickoff del proyecto",
        descripcion: "Reunión inicial para definir tareas, roles y objetivos.",
        lugar: "Discord / Online",
        fechaComienzo: new Date("2025-11-05T19:00:00.000Z"),
        fechaFinal: new Date("2025-11-05T20:30:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:10:00.000Z"),
        etiqueta: { color: "#FFA500", etiqueta: "Importante", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737112"),
        calendarioId: "690a57be4b34bc71b827a216",
        titulo: "Revisión sprint 1",
        descripcion: "Analizar avances del primer sprint.",
        lugar: "Discord / Online",
        fechaComienzo: new Date("2025-11-12T19:00:00.000Z"),
        fechaFinal: new Date("2025-11-12T20:00:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:15:00.000Z"),
        etiqueta: { color: "#FF69B4", etiqueta: "Revision", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737113"),
        calendarioId: "690a57be4b34bc71b827a216",
        titulo: "Revisión milestones Q1",
        descripcion: "Validar si los hitos del primer trimestre están completos.",
        lugar: "Discord / Online",
        fechaComienzo: new Date("2025-11-19T19:00:00.000Z"),
        fechaFinal: new Date("2025-11-19T20:30:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:20:00.000Z"),
        etiqueta: { color: "#800080", etiqueta: "Final", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0b0" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },

    // --- SUBCALENDARIO: DISEÑO DE PERSONAJES ---
    {
        _id: ObjectId("66fa1a01fee6ad04b5737114"),
        calendarioId: "690a5bbcb1ce2e2d9f5b8145",
        titulo: "Bocetos del protagonista",
        descripcion: "Primera fase de diseño del personaje principal.",
        lugar: "Tablet / PC",
        fechaComienzo: new Date("2025-11-06T17:00:00.000Z"),
        fechaFinal: new Date("2025-11-06T19:00:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:25:00.000Z"),
        etiqueta: { color: "#FFA500", etiqueta: "Importante", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737115"),
        calendarioId: "690a5bbcb1ce2e2d9f5b8145",
        titulo: "Revisión de estilo de NPCs",
        descripcion: "Ajuste visual de NPCs para coherencia artística.",
        lugar: "Tablet / PC",
        fechaComienzo: new Date("2025-11-13T17:00:00.000Z"),
        fechaFinal: new Date("2025-11-13T18:30:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:30:00.000Z"),
        etiqueta: { color: "#FF69B4", etiqueta: "Revision", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },

    // --- SUBCALENDARIO: MÚSICA Y SONIDO ---
    {
        _id: ObjectId("66fa1a01fee6ad04b5737116"),
        calendarioId: "690a5c19b1ce2e2d9f5b8146",
        titulo: "Lluvia de ideas de temas principales",
        descripcion: "Brainstorming para melodías principales del juego.",
        lugar: "Estudio casero",
        fechaComienzo: new Date("2025-11-07T21:00:00.000Z"),
        fechaFinal: new Date("2025-11-07T22:30:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:35:00.000Z"),
        etiqueta: { color: "#1E90FF", etiqueta: "Ocio", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737117"),
        calendarioId: "690a5c19b1ce2e2d9f5b8146",
        titulo: "Grabación de maquetas",
        descripcion: "Prototipos de temas y efectos iniciales.",
        lugar: "Estudio casero",
        fechaComienzo: new Date("2025-11-14T21:00:00.000Z"),
        fechaFinal: new Date("2025-11-14T23:00:00.000Z"),
        fechaCreacion: new Date("2025-11-04T20:40:00.000Z"),
        etiqueta: { color: "#FF69B4", etiqueta: "Revision", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a6" },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 36.7213,
        longitud: -4.4216
    },

    // === EVENTOS DEL RESTO DE CALENDARIOS ===

    {
        _id: ObjectId("66fa1a01fee6ad04b5737101"),
        calendarioId: "69088a48fee6ad04b573713f",
        titulo: "Preparar maletas",
        descripcion: "Empacar ropa y regalos antes del viaje.",
        lugar: "Casa",
        fechaComienzo: new Date("2025-12-20T09:00:00.000Z"),
        fechaFinal: new Date("2025-12-20T11:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:00:00.000Z"),
        etiqueta: { color: "#FFA500", etiqueta: "Importante", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 36.7213,
        longitud: -4.4216
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737102"),
        calendarioId: "69088a48fee6ad04b573713f",
        titulo: "Cena de Navidad",
        descripcion: "Cena familiar tradicional.",
        lugar: "Casa de los abuelos",
        fechaComienzo: new Date("2025-12-24T20:00:00.000Z"),
        fechaFinal: new Date("2025-12-25T01:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:05:00.000Z"),
        etiqueta: { color: "#008000", etiqueta: "Familiar", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a2" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 36.7320,
        longitud: -4.4663
    },
    {
        _id: ObjectId("66fa1a01fee6ad04b5737103"),
        calendarioId: "69088a48fee6ad04b573713f",
        titulo: "Viaje a Sierra Nevada",
        descripcion: "Vacaciones de esquí con amigos.",
        lugar: "Granada",
        fechaComienzo: new Date("2025-12-27T08:00:00.000Z"),
        fechaFinal: new Date("2026-01-02T20:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:10:00.000Z"),
        etiqueta: { color: "#1E90FF", etiqueta: "Ocio", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 37.0914,
        longitud: -3.3976
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737104"),
        calendarioId: "69088c5dfee6ad04b5737140",
        titulo: "Examen de Bases de Datos",
        descripcion: "Examen final de la asignatura.",
        lugar: "UMA",
        fechaComienzo: new Date("2025-11-10T09:30:00.000Z"),
        fechaFinal: new Date("2025-11-10T11:30:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:15:00.000Z"),
        etiqueta: { color: "#FF0000", etiqueta: "Urgente", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a4" },
        usuarioId: "71aa1a01fee6ad04b5737003",
        latitud: 36.7157,
        longitud: -4.4777
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737105"),
        calendarioId: "69088c5dfee6ad04b5737140",
        titulo: "Entrega de proyecto de IA",
        descripcion: "Subir el proyecto final a la plataforma.",
        lugar: "Campus Virtual",
        fechaComienzo: new Date("2025-11-15T18:00:00.000Z"),
        fechaFinal: new Date("2025-11-15T19:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:20:00.000Z"),
        etiqueta: { color: "#FFA500", etiqueta: "Importante", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1" },
        usuarioId: "71aa1a01fee6ad04b5737003",
        latitud: 36.7190,
        longitud: -4.4200
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737106"),
        calendarioId: "69088c5dfee6ad04b5737140",
        titulo: "Tutoría con el profesor de Programacion",
        descripcion: "Resolver dudas del parcial.",
        lugar: "Despacho 2.15",
        fechaComienzo: new Date("2025-11-05T11:00:00.000Z"),
        fechaFinal: new Date("2025-11-05T11:30:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:25:00.000Z"),
        etiqueta: { color: "#4682B4", etiqueta: "Académico", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a5" },
        usuarioId: "71aa1a01fee6ad04b5737003",
        latitud: 36.7159,
        longitud: -4.4737
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737107"),
        calendarioId: "69088c8dfee6ad04b5737141",
        titulo: "Entrenamiento físico",
        descripcion: "Sesión de cardio y resistencia.",
        lugar: "Gimnasio municipal",
        fechaComienzo: new Date("2025-11-04T18:00:00.000Z"),
        fechaFinal: new Date("2025-11-04T19:30:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:30:00.000Z"),
        etiqueta: { color: "#00CED1", etiqueta: "Entrenamiento", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a7" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 36.7250,
        longitud: -4.4420
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737108"),
        calendarioId: "69088c8dfee6ad04b5737141",
        titulo: "Partido amistoso",
        descripcion: "Partido entre equipos locales.",
        lugar: "Campo de Rugby de Teatinos",
        fechaComienzo: new Date("2025-11-08T17:00:00.000Z"),
        fechaFinal: new Date("2025-11-08T19:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:35:00.000Z"),
        etiqueta: { color: "#32CD32", etiqueta: "Competición", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a8" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 36.7200,
        longitud: -4.4500
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737109"),
        calendarioId: "69088c8dfee6ad04b5737141",
        titulo: "Charla motivacional del club",
        descripcion: "Sesión con exjugadores profesionales.",
        lugar: "Sala del club",
        fechaComienzo: new Date("2025-11-06T20:00:00.000Z"),
        fechaFinal: new Date("2025-11-06T21:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:40:00.000Z"),
        etiqueta: { color: "#FFD700", etiqueta: "Evento especial", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a9" },
        usuarioId: "71aa1a01fee6ad04b5737002",
        latitud: 36.7260,
        longitud: -4.4450
    },

    {
        _id: ObjectId("66fa1a01fee6ad04b5737110"),
        calendarioId: "69088c5dfee6ad04b5737140",
        titulo: "Presentación del TFG",
        descripcion: "Defensa ante el tribunal.",
        lugar: "Aula Magna",
        fechaComienzo: new Date("2025-12-02T10:00:00.000Z"),
        fechaFinal: new Date("2025-12-02T11:00:00.000Z"),
        fechaCreacion: new Date("2025-11-03T11:45:00.000Z"),
        etiqueta: { color: "#800080", etiqueta: "Final", etiquetaId: "60a9b5f9c8d3a1f4b0e8d0b0" },
        usuarioId: "71aa1a01fee6ad04b5737003",
        latitud: 36.7150,
        longitud: -4.4700
    },
    {
        _id: ObjectId("76fa1a01fee6ad04b5739001"),
        calendarioId: "790b781b1fa1bc71b827a901",
        titulo: "Concierto Año Nuevo",
        descripcion: "Concierto público de inicio de año.",
        lugar: "Madrid",
        fechaComienzo: new Date("2026-01-01T20:00:00.000Z"),
        fechaFinal: new Date("2026-01-01T23:00:00.000Z"),
        fechaCreacion: new Date(),
        etiqueta: {
            color: "#1E90FF",
            etiqueta: "Ocio",
            etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a3"
        },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 40.4168,
        longitud: -3.7038
    },
        {
        _id: ObjectId("76fa1a01fee6ad04b5739002"),
        calendarioId: "790b78591fa1bc71b827a902",
        titulo: "Expo Arte Moderno",
        descripcion: "Gran exposición pública de arte contemporáneo.",
        lugar: "Barcelona",
        fechaComienzo: new Date("2026-03-12T10:00:00.000Z"),
        fechaFinal: new Date("2026-03-12T18:00:00.000Z"),
        fechaCreacion: new Date(),
        etiqueta: {
            color: "#FFA500",
            etiqueta: "Importante",
            etiquetaId: "60a9b5f9c8d3a1f4b0e8d0a1"
        },
        usuarioId: "71aa1a01fee6ad04b5737001",
        latitud: 41.3874,
        longitud: 2.1686
    }
]);




// =========================================================
// ============== COMENTARIOS, ETIQUETAS Y NOTIFICACIONES ==
// =========================================================


db.comentario.insertMany(
    [
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737201"),
            "texto": "Recuerda empacar tambien los regalos de los niños.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-12-18T10:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737101"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737202"),
            "texto": "No olvides las cadenas para la nieve.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-12-19T08:30:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737101"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737203"),
            "texto": "Alguien trae la ensalada para la cena?",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-12-24T12:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737102"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737204"),
            "texto": "He comprado el postre, lo traigo yo.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-12-24T13:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737102"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737205"),
            "texto": "Revisar material de esqui antes de salir.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-12-26T09:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737103"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737206"),
            "texto": "Confirmar reserva del apartamento.",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-12-26T10:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737103"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737207"),
            "texto": "Repasar temas de bases de datos antes del examen.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-11-09T16:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737104"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737208"),
            "texto": "Alguien quiere hacer grupo de estudio?",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-11-09T17:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737104"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737209"),
            "texto": "No olvidar subir el proyecto a la plataforma antes de la fecha limite.",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-11-14T14:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737105"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737210"),
            "texto": "Verificar el formato del documento antes de enviar.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-11-14T15:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737105"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737211"),
            "texto": "Preparar preguntas para la tutoria.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-11-04T10:30:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737106"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737212"),
            "texto": "Traer apuntes de clase de la semana pasada.",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-11-04T11:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737106"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737213"),
            "texto": "No olvidar estirar antes del entrenamiento.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-11-03T17:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737107"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737214"),
            "texto": "Traer botella de agua extra.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-11-03T17:15:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737107"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737215"),
            "texto": "Recordar llegar 30 minutos antes del partido.",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-11-08T16:20:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737108"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737216"),
            "texto": "Llevar camisetas de repuesto.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-11-08T16:30:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737108"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737217"),
            "texto": "Tomar notas de la charla para el equipo.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-11-06T19:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737109"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737218"),
            "texto": "Traer preguntas sobre estrategias de juego.",
            "usuarioAlias": "usuario1",
            "usuarioId": "71aa1a01fee6ad04b5737002",
            "fechaCreacion": new Date("2025-11-06T19:30:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737109"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737219"),
            "texto": "Preparar la presentacion del TFG con diapositivas.",
            "usuarioAlias": "usuario2",
            "usuarioId": "71aa1a01fee6ad04b5737003",
            "fechaCreacion": new Date("2025-12-01T09:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737110"
        },
        {
            "_id": ObjectId("70fa1a01fee6ad04b5737220"),
            "texto": "Revisar referencias bibliogrificas antes de presentar.",
            "usuarioAlias": "usuario3",
            "usuarioId": "71aa1a01fee6ad04b5737004",
            "fechaCreacion": new Date("2025-12-01T10:00:00.000Z"),
            "eventoId": "66fa1a01fee6ad04b5737110"
        }
    ]
);


db.etiqueta.insertMany([
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a1"), "etiqueta": "Importante", "color": "#FFA500" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a2"), "etiqueta": "Familiar", "color": "#008000" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a3"), "etiqueta": "Ocio", "color": "#1E90FF" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a4"), "etiqueta": "Urgente", "color": "#FF0000" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a5"), "etiqueta": "Acadimico", "color": "#4682B4" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a6"), "etiqueta": "Revision", "color": "#FF69B4" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a7"), "etiqueta": "Entrenamiento", "color": "#00CED1" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a8"), "etiqueta": "Competicion", "color": "#32CD32" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0a9"), "etiqueta": "Evento especial", "color": "#FFD700" },
    { "_id": ObjectId("60a9b5f9c8d3a1f4b0e8d0b0"), "etiqueta": "Final", "color": "#800080" }
]);


db.notificacion.insertMany([
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737301"),
        "usuarioId": "71aa1a01fee6ad04b5737002", // usuario1 creó este evento
        "leido": false,
        "comentario": "Recuerda empacar tambien los regalos de los niños.",
        "comentarioUsuario": "usuario2",
        "evento": "Preparar maletas"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737302"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "No olvides las cadenas para la nieve.",
        "comentarioUsuario": "usuario3",
        "evento": "Preparar maletas"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737303"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Alguien trae la ensalada para la cena?",
        "comentarioUsuario": "usuario1",
        "evento": "Cena de Navidad"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737304"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "He comprado el postre, lo traigo yo.",
        "comentarioUsuario": "usuario2",
        "evento": "Cena de Navidad"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737305"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Revisar material de esqui antes de salir.",
        "comentarioUsuario": "usuario3",
        "evento": "Viaje de esquí"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737306"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Confirmar reserva del apartamento.",
        "comentarioUsuario": "usuario1",
        "evento": "Viaje de esquí"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737307"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Repasar temas de bases de datos antes del examen.",
        "comentarioUsuario": "usuario2",
        "evento": "Examen de BBDD"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737308"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Alguien quiere hacer grupo de estudio?",
        "comentarioUsuario": "usuario3",
        "evento": "Examen de BBDD"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737309"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "No olvidar subir el proyecto a la plataforma antes de la fecha limite.",
        "comentarioUsuario": "usuario1",
        "evento": "Entrega de proyecto"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737310"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Verificar el formato del documento antes de enviar.",
        "comentarioUsuario": "usuario2",
        "evento": "Entrega de proyecto"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737311"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Preparar preguntas para la tutoria.",
        "comentarioUsuario": "usuario3",
        "evento": "Tutoría semanal"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737312"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Traer apuntes de clase de la semana pasada.",
        "comentarioUsuario": "usuario1",
        "evento": "Tutoría semanal"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737313"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "No olvidar estirar antes del entrenamiento.",
        "comentarioUsuario": "usuario2",
        "evento": "Entrenamiento"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737314"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Traer botella de agua extra.",
        "comentarioUsuario": "usuario3",
        "evento": "Entrenamiento"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737315"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Recordar llegar 30 minutos antes del partido.",
        "comentarioUsuario": "usuario1",
        "evento": "Partido del sábado"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737316"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Llevar camisetas de repuesto.",
        "comentarioUsuario": "usuario2",
        "evento": "Partido del sábado"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737317"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Tomar notas de la charla para el equipo.",
        "comentarioUsuario": "usuario3",
        "evento": "Charla del equipo"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737318"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Traer preguntas sobre estrategias de juego.",
        "comentarioUsuario": "usuario1",
        "evento": "Charla del equipo"
    },

    {
        "_id": ObjectId("71fa1a01fee6ad04b5737319"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Preparar la presentacion del TFG con diapositivas.",
        "comentarioUsuario": "usuario2",
        "evento": "Presentación TFG"
    },
    {
        "_id": ObjectId("71fa1a01fee6ad04b5737320"),
        "usuarioId": "71aa1a01fee6ad04b5737002",
        "leido": false,
        "comentario": "Revisar referencias bibliogrificas antes de presentar.",
        "comentarioUsuario": "usuario3",
        "evento": "Presentación TFG"
    }
]);





// =========================================================
// ============== COLECCIÓN USUARIO CORREGIDA ==============
// =========================================================

// db.usuario.insertMany([
//     {
//         _id: ObjectId("71aa1a01fee6ad04b5737001"),
//         alias: "usuario123",
//         email: "usuario123@example.com",
//         foto: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764675522/p3o73gllusdnxt9invnm.jpg",
//         recibirNotificaciones: true,
//         calendariosCreados: [
//             "690b77e2aa12bc71b827a777",
//             "690a57be4b34bc71b827a216"
//         ],
//         calendariosSuscritos: []
//     },
//     {
//         _id: ObjectId("71aa1a01fee6ad04b5737002"),
//         alias: "usuario1",
//         email: "usuario1@example.com",
//         foto: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764677805/ijqo0pkwhzwrozqqtept.jpg",
//         recibirNotificaciones: false,
//         calendariosCreados: [
//             "69088a48fee6ad04b573713f"
//         ],
//         calendariosSuscritos: []
//     },
//     {
//         _id: ObjectId("71aa1a01fee6ad04b5737003"),
//         alias: "usuario2",
//         email: "usuario2@example.com",
//         foto: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764675434/tqusxeneudnuuy0aznu5.png",
//         recibirNotificaciones: true,
//         calendariosCreados: [
//             "69088c5dfee6ad04b5737140"
//         ],
//         calendariosSuscritos: []
//     },
//     {
//         _id: ObjectId("71aa1a01fee6ad04b5737004"),
//         alias: "usuario3",
//         email: "usuario3@example.com",
//         foto: "https://res.cloudinary.com/dwcl31zpr/image/upload/v1764676314/teqosn97cn5w85glpuby.png",
//         recibirNotificaciones: false,
//         calendariosCreados: [],
//         calendariosSuscritos: []
//     }
// ]);
