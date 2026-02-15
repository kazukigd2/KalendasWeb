// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================

// Imports Básicos

// Imports propios
import Boton from "../Boton";
import { EventoDTO } from "../../schemas/KalendasSchemas";
import ComentariosEvento from "../Comentarios/ComentariosEvento";
import { useUsuario } from "contextos/UsuarioContext";

// IMPORTAMOS LOS COMPONENTES EXTERNOS
import Mapa from "../Externos/Mapa"; 
import Multimedia from "../Externos/Multimedia"; // <--- NUEVO IMPORT


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface PopupEventoProps {
    ev: EventoDTO;
    onClose: () => void;
    onSolicitarEliminar: (eventoId: string) => void;
    onSolicitarEditar: (evento: EventoDTO) => void;
}

// ======================================================================
// ============================COMPONENTE ===============================
// ======================================================================
export function PopupEvento({ ev, onClose, onSolicitarEliminar, onSolicitarEditar }: PopupEventoProps) {
    
    const latitudEvento = ev.evento.latitud;
    const longitudEvento = ev.evento.longitud;
    const { calendarios, calendariosSuscritos, usuario } = useUsuario();
    const esPropietario = usuario?._id === ev.evento.usuarioId;

    // Buscar un calendario en toda la jerarquía
    const buscarCalendarioPorId = (lista: any[], id: string): any | null => {
        for (const cal of lista) {
            if (cal._id === id) return cal;
            if (cal.subcalendarios?.length) {
                const encontrado = buscarCalendarioPorId(cal.subcalendarios, id);
                if (encontrado) return encontrado;
            }
        }
        return null;
    };

    const calendariosUnificados = [...calendarios, ...calendariosSuscritos]
    //  Obtenemos el calendario del evento
    const calendarioEvento = buscarCalendarioPorId(calendariosUnificados, ev.evento.calendarioId);

    return (
        <div className="evento-popup-overlay" onClick={onClose}>
            <div className="evento-popup-card" onClick={(e) => e.stopPropagation()}>

                {/* CABECERA PREMIUM */}
                <div className="evento-popup-header">
                    <div>
                        <h2>{ev.evento.titulo}</h2>
                        <br></br>
                        {calendarioEvento && (
                        <p className="evento-calendario-asociado">
                            Calendario: <strong>{calendarioEvento.titulo}</strong>
                        </p>
                        )}
                    </div>
                    <button className="evento-popup-close" onClick={onClose}>✕</button>
                </div>
                

                {/* CONTENIDO SCROLABLE */}
                <div className="evento-popup-scroll">
                <br></br>
                    {ev.evento.descripcion && (
                        <div className="ev-field">
                            <label>Descripción</label>
                            <p className="ev-text">{ev.evento.descripcion}</p>
                        </div>
                    )}

                    <div className="ev-two-col">
                        <div className="ev-field">
                            <label>Inicio</label>
                            <p className="ev-text">{new Date(ev.evento.fechaComienzo).toLocaleString()}</p>
                        </div>
                        <div className="ev-field">
                            <label>Fin</label>
                            <p className="ev-text">{new Date(ev.evento.fechaFinal).toLocaleString()}</p>
                        </div>
                    </div>

                    {ev.evento.lugar && (
                        <div className="ev-field">
                            <label>Lugar</label>
                            <p className="ev-text">{ev.evento.lugar}</p>
                        </div>
                    )}

                    {/* MAPA */}
                    <div className="ev-field">
                        <label>Ubicación en mapa</label>
                        <div className="ev-map-wrapper">
                            <Mapa
                                latitud={latitudEvento ?? undefined}
                                longitud={longitudEvento ?? undefined}
                                editable={false}
                            />
                        </div>
                    </div>

                    {/* MULTIMEDIA */}
                    <div className="ev-field">
                        <label>Multimedia</label>
                        <Multimedia
                            urls={ev.evento.multimedia || []}
                            editable={false}
                        />
                    </div>

                    <div className="ev-field">
                        <label>Comentarios</label>
                        <ComentariosEvento
                            eventoId={ev.evento._id}
                            tituloEvento={ev.evento.titulo}
                            propietarioEventoId={ev.evento.usuarioId}
                            comentariosIniciales={ev.comentarios}
                        />
                    </div>

                </div>

                {/* ACCIONES ABAJO */}
                <div className="evento-popup-actions">
                    {esPropietario && (
                    <Boton tipo="mini-rojo" onClick={() => onSolicitarEliminar(ev.evento._id)}>
                        Borrar
                    </Boton>
                    )}


                    {esPropietario && (
                        <Boton onClick={() => onSolicitarEditar(ev)}>
                            Editar
                        </Boton>
                    )}

                    
                    <Boton onClick={onClose}>
                        Cerrar
                    </Boton>
                    
                </div>

            </div>
        </div>
    );
}