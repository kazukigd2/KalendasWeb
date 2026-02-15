import { useEffect, useState } from "react";
import Boton from "../Boton";
import {
    crearComentario,
    eliminarComentario,
    modificarComentario
} from "../../services/KalendasService";
import { useUsuario } from "../../contextos/UsuarioContext";
import { ComentarioRespuesta } from "../../schemas/KalendasSchemas";
import "../../estilos/Comentarios/Comentarios.css";
import ConfirmacionPopUp from "../PopUp/ConfirmacionPopUp";
import { 
    obtenerUsuarioPorId,
    crearNotificacion 
} from "../../services/KalendasService";

import { EmailService } from "../../services/EmailService";

interface Props {
    eventoId: string;
    propietarioEventoId: string;
    tituloEvento: string;
    comentariosIniciales: ComentarioRespuesta[];
}

export default function ComentariosEvento({
    eventoId,
    propietarioEventoId,
    tituloEvento,
    comentariosIniciales
}: Props) {

    const { usuario } = useUsuario();
    const usuarioId = usuario?._id;

    const alias = usuario?.alias ?? "Desconocido";

    const [comentarios, setComentarios] = useState<ComentarioRespuesta[]>([]);
    const [nuevoTexto, setNuevoTexto] = useState("");
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [textoEditado, setTextoEditado] = useState("");

    // Popup confirmación
    const [popupVisible, setPopupVisible] = useState(false);
    const [accionPopup, setAccionPopup] = useState<() => void>(() => {});
    const [mensajePopup, setMensajePopup] = useState("");

    // Ordenar comentarios: más nuevo → más viejo
    useEffect(() => {
        setComentarios(
            [...comentariosIniciales].sort(
                (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
            )
        );
    }, [comentariosIniciales]);

    // Crear comentario + notificación + email
    async function handleCrear() {
        if (!nuevoTexto.trim()) return;

        // 1) Crear comentario en backend
        const nuevo = await crearComentario({
            texto: nuevoTexto,
            usuarioId: usuarioId!,
            eventoId,
            usuarioAlias: alias
        });

        setNuevoTexto("");

        if (!nuevo) return;

        // Lo insertamos arriba
        setComentarios(prev => [nuevo, ...prev]);

        try {
            // 2) Obtener dueño del evento
            const usuarioPropietario = await obtenerUsuarioPorId(propietarioEventoId);

            // 3) Obtener usuario que comentó
            if (!usuario) return;
            const usuarioAutor = usuario;

            // 4) Crear notificación en backend
            await crearNotificacion({
                usuarioId: usuarioPropietario._id,      // dueño del evento
                comentario: nuevo.texto,               // texto escrito
                comentarioUsuario: usuarioAutor.alias, // alias del autor
                evento: tituloEvento,                      // O puedes poner título si lo prefieres
                leido: false
            });

            // 5) Enviar email si corresponde
            if (usuarioPropietario.recibirNotificaciones) {
                await EmailService.sendCommentNotification({
                    to: usuarioPropietario.email,
                    author: usuarioAutor.alias,
                    eventName: tituloEvento, // si quieres título real, necesitarías pasarlo como prop
                    comment: nuevo.texto
                });
            }

        } catch (error) {
            console.error("Error generando notificación o email:", error);
        }
    }

    // === CONFIRMAR EDITAR ================================================
    function solicitarConfirmarEdicion(id: string) {
        setMensajePopup("¿Confirmar edición del comentario?");
        setAccionPopup(() => async () => {
            await modificarComentario(id, { texto: textoEditado });

            setComentarios(prev =>
                prev.map(c => c._id === id ? { ...c, texto: textoEditado } : c)
            );

            setEditandoId(null);
            setPopupVisible(false);
        });

        setPopupVisible(true);
    }

    // === CONFIRMAR ELIMINAR ==============================================
    function solicitarConfirmarEliminacion(id: string) {
        setMensajePopup("¿Seguro que quieres borrar este comentario?");
        setAccionPopup(() => async () => {
            await eliminarComentario(id);
            setComentarios(prev => prev.filter(c => c._id !== id));
            setPopupVisible(false);
        });

        setPopupVisible(true);
    }
    

    return (
        <div className="comentarios-container">
            <h3>Comentarios</h3>

            {popupVisible && (
                <ConfirmacionPopUp
                    mensaje={mensajePopup}
                    textoAceptar="Sí"
                    textoCancelar="No"
                    onAceptar={accionPopup}
                    onCancelar={() => setPopupVisible(false)}
                />
            )}

            {/* Crear comentario */}
            <div className="nuevo-comentario">
                <textarea
                    placeholder="Escribe un comentario..."
                    value={nuevoTexto}
                    onChange={(e) => setNuevoTexto(e.target.value)}
                ></textarea>

                <Boton onClick={handleCrear}>Enviar</Boton>
            </div><br></br><br></br>

            {/* Lista con scroll */}
 {comentarios.map((c) => {
    const puedeEditar = c.usuarioId === usuarioId;
    const puedeEliminar =
        c.usuarioId === usuarioId ||
        propietarioEventoId === usuarioId;

    return (
        <div key={c._id} className="comentario">

            <div className="comentario-header">
                <b>{c.usuarioAlias}</b>
                <span>{new Date(c.fechaCreacion).toLocaleString()}</span>
            </div>

            {editandoId === c._id ? (
                <>
                    <textarea
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                    ></textarea>

                    <Boton onClick={() => solicitarConfirmarEdicion(c._id)}>
                        Guardar
                    </Boton>

                    <Boton onClick={() => setEditandoId(null)}>
                        Cancelar
                    </Boton>
                </>
            ) : (
                <p>{c.texto}</p>
            )}
           
            {/* SOLO SE MOSTRARÁN LOS BOTONES SI NO ESTÁ EDITANDO */}
            {editandoId !== c._id && (
                <div className="comentario-acciones">
                    {puedeEditar && (
                        <Boton onClick={() => {
                            setEditandoId(c._id);
                            setTextoEditado(c.texto);
                        }}>
                            Editar
                        </Boton>
                    )}

                    {puedeEliminar && (
                        <Boton onClick={() => solicitarConfirmarEliminacion(c._id)}>
                            Eliminar
                        </Boton>
                    )}
                </div>
            )}

        </div>
    );
})}
            </div>
        
    );
}
