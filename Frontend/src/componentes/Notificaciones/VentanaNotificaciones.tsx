// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React from "react";
import "../../estilos/Notificaciones/VentanaNotificaciones.css";

//Imports propios
import Notificacion from "./Notificacion";
import Boton from "../Boton";
import { NotificacionRespuesta } from "../../schemas/KalendasSchemas";
import { eliminarNotificacion, listarNotificaciones, cambiarEstadoLeido, eliminarNotificacionesPorIds, marcarTodasNotificacionesLeidas } from "../../services/KalendasService";
import { useUsuario } from "../../contextos/UsuarioContext";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface Props {
    notificaciones: (NotificacionRespuesta & { removing?: boolean })[];
    setNotificaciones: (n: (NotificacionRespuesta & { removing?: boolean })[]) => void;
    cerrando?: boolean;
    notiMenuRef?: React.RefObject<HTMLDivElement>;
}


// ======================================================================
// ========================= Funciones Globales =========================
// ======================================================================



// ======================================================================
// ============================COMPONENTE ===============================
// ======================================================================
const VentanaNotificaciones: React.FC<Props> = ({
    notificaciones,
    setNotificaciones,
    cerrando,
    notiMenuRef
}) => {


// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================

    const { usuario } = useUsuario();
    const usuarioId = usuario?._id!;
    
// ======================================================================
// ========================== Funciones  ================================
// ======================================================================

    //Marcar una notificación como leída
    const marcarLeida = async (id: string) => {
        console.log("Marcando como leída:", id);

        // Llamada al backend
        const ok = await cambiarEstadoLeido(id, true);

        if (!ok) {
            console.error("❌ No se pudo actualizar el estado en backend");
            return;
        }

        // Si funciona el backend, ahora sí cambiamos localmente
        const nuevas = notificaciones.map(n =>
            n._id === id ? { ...n, leido: true } : n
        );

        setNotificaciones(nuevas);
    };


    //Eliminar una notificación individual
    const eliminarNoti = async (id: string) => {
        console.log("Eliminando notificación con id:", id);

        const ok = await eliminarNotificacion(id);

        if (!ok) {
            console.error("No se pudo eliminar la notificación en backend");
            return;
        }

        // Activar animación solo en la noti eliminada
        const animadas = notificaciones.map(n =>
            n._id === id ? { ...n, removing: true } : n
        );

        setNotificaciones(animadas);

        // Quitamos de la UI tras animación
        setTimeout(async () => {

            // 🔄 Volver a cargar desde backend
            const nuevas = await listarNotificaciones(usuarioId);
            setNotificaciones(nuevas);

        }, 350);
    };

    //Eliminar todas las notificaciones leídas
    const eliminarNotificacionesLeidas = async () => {
        // Obtener solo los IDs de las leídas
        const idsLeidas = notificaciones
            .filter(n => n.leido)
            .map(n => n._id);

        if (idsLeidas.length === 0) return;

        // Animación antes de eliminar
        const conAnimacion = notificaciones.map(n =>
            n.leido ? { ...n, removing: true } : n
        );
        setNotificaciones(conAnimacion);

        // Esperar animación
        setTimeout(async () => {
            // Llamada real al backend
            const ok = await eliminarNotificacionesPorIds(idsLeidas);

            if (!ok) {
                console.error("Error eliminando las leídas");
                return;
            }

            // Recargar lista desde backend (recomendado)
            const nuevas = await listarNotificaciones(usuarioId);
            setNotificaciones(nuevas);

        }, 350);
    };


    //Marcar todas como leídas
    const marcarTodas = async () => {

        const ok = await marcarTodasNotificacionesLeidas(usuarioId);

        if (!ok) {
            console.error("Error: No se pudieron marcar todas como leídas");
            return;
        }

        // Recargar desde backend para sincronizar
        const nuevas = await listarNotificaciones(usuarioId);

        setNotificaciones(nuevas);
    };



// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
    return (
        <div
            ref={notiMenuRef}
            className={`ventana-notificaciones ${cerrando ? "cerrando" : ""}`}
        >

            {/* CABECERA */}
            <div className="ventana-header">

                <div className="ventana-header-top">
                    <h3 className="ventana-titulo">Notificaciones</h3>

                    {/* Botón pequeño: Marcar todas leídas */}
                    <Boton tipo="mini" onClick={marcarTodas}>
                        Todas leídas
                    </Boton>
                    {/* Botón pequeño rojo: Borrar todas las leídas */}
                    <Boton tipo="mini-rojo" onClick={eliminarNotificacionesLeidas}>
                        Borrar todas
                    </Boton>
                </div>
            </div>

            {/* LISTA DE NOTIFICACIONES */}
            {notificaciones.map((n) => (
                <Notificacion
                    key={n._id}
                    noti={n}
                    onLeer={() => marcarLeida(n._id)}
                    onEliminar={() => eliminarNoti(n._id)}
                />
            ))}

        </div>
    );
};

export default VentanaNotificaciones;
