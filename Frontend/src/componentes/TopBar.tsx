// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
import React, { useState, useEffect, useRef } from "react";
import "../estilos/TopBar/TopBar.css";
import { useNavigate, NavLink  } from "react-router-dom";

// Imports propios
import VentanaNotificaciones from "./Notificaciones/VentanaNotificaciones";
import Boton from "./Boton";
import { useUsuario, UsuarioProvider } from "../contextos/UsuarioContext";
import campanaIcono from "../imagenes/IconoNotificaciones.svg";
import avatarIcono from "../imagenes/Avatar.jpg";
import cuentaIcono from "../imagenes/IconoCuenta.svg";
import cerrarSesionIcono from "../imagenes/IconoCerrarSesion.svg";
import paletaIcono from "../imagenes/IconoPaleta.svg";
import homeIcono from "../imagenes/IconoHome.svg";
import calendarioIcono from "../imagenes/IconoCalendario.svg";
import lupaIcono from "../imagenes/IconoLupa.svg";
import temaAzulIcono from "../imagenes/IconoTemaAzul.svg";
import temaNocturnoIcono from "../imagenes/IconoTemaNocturno.svg";
import temaMarronIcono from "../imagenes/IconoTemaMarron.svg";
import { listarNotificaciones } from "../services/KalendasService";


// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const TopBar: React.FC = () => {

    // ======================================================================
    // ========== Variables de Estado del componente ========================
    // ======================================================================
    const navigate = useNavigate();
    
    // 1. AÑADIMOS 'usuario' AL DESTRUCTURING PARA LEER SUS DATOS
    const { notificaciones, setNotificaciones, usuario, setUsuario, setCalendarios } = useUsuario();

    const [nuevasNotificaciones, setNuevasNotificaciones] = useState(0);

    const [menuAvatarAbierto, setMenuAvatarAbierto] = useState(false);    // Menú del avatar
    const [animandoMenuAvatar, setAnimandoMenuAvatar] = useState(false);

    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);      // Menú hamburguesa

    const [verNotificaciones, setVerNotificaciones] = useState(false);
    const [animandoNoti, setAnimandoNoti] = useState(false);

    const avatarMenuRef = useRef<HTMLDivElement | null>(null);
    const avatarButtonRef = useRef<HTMLDivElement | null>(null);

    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const burgerRef = useRef<HTMLDivElement | null>(null);

    const notiMenuRef = useRef<HTMLDivElement>(null!);
    const notiButtonRef = useRef<HTMLDivElement | null>(null);

    const [menuPaletteAbierto, setMenuPaletteAbierto] = useState(false);
    const [animandoMenuPalette, setAnimandoMenuPalette] = useState(false);

    const paletteMenuRef = useRef<HTMLDivElement | null>(null);
    const paletteButtonRef = useRef<HTMLDivElement | null>(null);

    const [temaActual, setTemaActual] = useState<"default" | "estilo2" | "estilo3">("default");
    const { cerrarSesion } = useUsuario();


    // ======================================================================
    // ========================== Funciones ================================
    // ======================================================================

    const cambiarTema = (tema: "default" | "estilo2" | "estilo3") => {
        const html = document.documentElement;

        html.classList.remove("estilo2", "estilo3");
        if (tema !== "default") html.classList.add(tema);

        // Guardar en estado y en localStorage
        setTemaActual(tema);
        localStorage.setItem("tema-kalendas", tema);

        // Cerrar menú
        setMenuPaletteAbierto(false);
    };

    useEffect(() => {
    const temaGuardado = localStorage.getItem("tema-kalendas") as
            | "default"
            | "estilo2"
            | "estilo3"
            | null;

            if (temaGuardado) {
                setTemaActual(temaGuardado);

                const html = document.documentElement;
                html.classList.remove("estilo2", "estilo3");
                if (temaGuardado !== "default") html.classList.add(temaGuardado);
            }
    }, []);

    const isActive = (path: string) =>
        window.location.pathname === path ? "active" : "";

    // Calcular notificaciones sin leer
    useEffect(() => {
        const sinLeer = notificaciones.filter(n => !n.leido).length;
        setNuevasNotificaciones(sinLeer);
    }, [notificaciones]);


    /* =============================
       TOGGLE NOTIFICACIONES
    ============================== */
    const toggleNotificaciones = async () => {
        if (verNotificaciones) {
            setAnimandoNoti(true);
            setTimeout(() => {
                setVerNotificaciones(false);
                setAnimandoNoti(false);
            }, 180);
        } else {      
        // Abriendo ventana → RECARGAR NOTIFICACIONES
        if (usuario?._id) {
            try {
                const nuevas = await listarNotificaciones(usuario._id);
                setNotificaciones(nuevas);
            } catch (e) {
                console.error("Error actualizando notificaciones al abrir:", e);
            }
        }
            setVerNotificaciones(true);
            setMenuAvatarAbierto(false);
            setMenuMovilAbierto(false);
        }
    };

    /* =============================
       TOGGLE MENÚ PALETA COLORES
    ============================== */
    const togglePaletteMenu = () => {
        setMenuMovilAbierto(false);
        setMenuAvatarAbierto(false);
        setVerNotificaciones(false);

        if (menuPaletteAbierto) {
            setAnimandoMenuPalette(true);
            setTimeout(() => {
                setMenuPaletteAbierto(false);
                setAnimandoMenuPalette(false);
            }, 400);
        } else {
            setMenuPaletteAbierto(true);
            setAnimandoMenuPalette(false);
        }
    };


    /* =============================
       TOGGLE MENÚ AVATAR
    ============================== */
    const toggleMenuAvatar = () => {

        // Cerrar menú móvil si está abierto
        setMenuMovilAbierto(false);

        if (menuAvatarAbierto) {
            setAnimandoMenuAvatar(true);

            setTimeout(() => {
                setMenuAvatarAbierto(false);
                setAnimandoMenuAvatar(false);
            }, 400);
        } else {
            setMenuAvatarAbierto(true);
            setAnimandoMenuAvatar(false);
            setVerNotificaciones(false);
        }
    };


    /* =============================
       TOGGLE MENÚ MÓVIL (HAMBURGUESA)
    ============================== */
    const toggleMenuMovil = () => {
        setMenuMovilAbierto(!menuMovilAbierto);

        // Cerrar avatar si está abierto
        setMenuAvatarAbierto(false);

        setVerNotificaciones(false);
    };


    // ======================================================================
    // ================= CLICK OUTSIDE PARA CERRAR MENÚS =====================
    // ======================================================================
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            // ====== CERRAR MENÚ AVATAR ======
            if (
                menuAvatarAbierto &&
                avatarMenuRef.current &&
                !avatarMenuRef.current.contains(target) &&
                avatarButtonRef.current &&
                !avatarButtonRef.current.contains(target)
            ) {
                setMenuAvatarAbierto(false);
            }

            // ====== CERRAR NOTIFICACIONES ======
            if (
                verNotificaciones &&
                notiMenuRef.current &&
                !notiMenuRef.current.contains(target) &&
                notiButtonRef.current &&
                !notiButtonRef.current.contains(target)
            ) {
                setVerNotificaciones(false);
            }

            // ====== CERRAR MENÚ DE PALETAS ======
            if (
                menuPaletteAbierto &&
                paletteMenuRef.current &&
                !paletteMenuRef.current.contains(target) &&
                paletteButtonRef.current &&
                !paletteButtonRef.current.contains(target)
            ) {
                setMenuPaletteAbierto(false);
            }

            // ====== CERRAR MENÚ MÓVIL ======
            if (
                menuMovilAbierto &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(target) &&
                burgerRef.current &&
                !burgerRef.current.contains(target)
            ) {
                setMenuMovilAbierto(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuAvatarAbierto, verNotificaciones, menuMovilAbierto, menuPaletteAbierto]);

    


    // ======================================================================
    // ===================== Return (HTML de respuesta) =====================
    // ======================================================================
    return (
        <header className="topbar">

            <div className="topbar-inner">

                {/* ====================== HAMBURGUESA (Solo móvil) ====================== */}
                <div className="topbar-burger" ref={burgerRef} onClick={toggleMenuMovil}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* ====================== IZQUIERDA ====================== */}
                <div className="topbar-left">
                    <h1 className="topbar-title">Kalendas</h1>
                </div>

                {/* ====================== NAVEGACIÓN CENTRADA (oculta en móvil) ====================== */}
                <nav className="topbar-nav">
                    <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
                        Home
                    </NavLink>
                    <NavLink to="/calendario" className={({ isActive }) => isActive ? "active" : ""}>
                        Mis Calendarios
                    </NavLink>
                    <NavLink to="/buscar-calendarios" className={({ isActive }) => isActive ? "active" : ""}>
                        Buscar Calendarios
                    </NavLink>
                </nav>

                {/* ====================== DERECHA ====================== */}
                <div className="topbar-actions">

                    {/* CAMPANITA */}
                    <div ref={notiButtonRef}>
                        <Boton
                            tipo="icono-notif"
                            count={nuevasNotificaciones}
                            onClick={toggleNotificaciones}
                        >
                            <img
                                src={campanaIcono}
                                alt="Notificaciones"
                                className="icono-campana"
                            />
                        </Boton>
                    </div>

                    {verNotificaciones && (
                        <VentanaNotificaciones
                            cerrando={animandoNoti}
                            notificaciones={notificaciones}
                            setNotificaciones={setNotificaciones}
                            notiMenuRef={notiMenuRef}
                        />
                    )}

                    {/* PALETA DE COLORES */}
                    <div ref={paletteButtonRef}> 
                        <Boton
                            tipo="icono-notif" // Usamos el mismo estilo que la campana
                            onClick={togglePaletteMenu}
                        >
                            <img
                                src={paletaIcono}
                                alt="Paleta de colores"
                                className="icono-campana"
                            />
                        </Boton>

                        {(menuPaletteAbierto || animandoMenuPalette) && (
                            <div
                                ref={paletteMenuRef}
                                className={
                                    "topbar-menu " +
                                    (animandoMenuPalette ? "cerrando" : "activo")
                                }
                                
                                
                            >
                                <Boton
                                    tipo="menu"
                                    className={temaActual === "default" ? "tema-seleccionado" : ""}
                                    onClick={() => cambiarTema("default")}
                                >
                                    <img
                                        src={temaAzulIcono}
                                        className="icono-azul icono-opciones"
                                    /> Tema 1
                                </Boton>

                                <Boton
                                    tipo="menu"
                                    className={temaActual === "estilo2" ? "tema-seleccionado" : ""}
                                    onClick={() => cambiarTema("estilo2")}
                                >
                                    <img
                                        src={temaMarronIcono}
                                        className="icono-marron icono-opciones"
                                    /> Tema 2
                                </Boton>

                                <Boton
                                    tipo="menu"
                                    className={temaActual === "estilo3" ? "tema-seleccionado" : ""}
                                    onClick={() => cambiarTema("estilo3")}
                                >
                                    <img
                                        src={temaNocturnoIcono}
                                        className="icono-campana icono-opciones"
                                    /> Tema 3
                                </Boton>
                            </div>
                        )}
                    </div>

                    {/* AVATAR */}
                    <div className="topbar-user" ref={avatarButtonRef} onClick={toggleMenuAvatar}>
                        <img
                            // 2. USAMOS LA FOTO DEL USUARIO O EL ICONO POR DEFECTO
                            src={usuario?.foto || avatarIcono}
                            alt="Usuario"
                            className="topbar-user-icon"
                            // Añadimos objectFit cover para que las fotos de usuario no se deformen
                            style={{ objectFit: "cover" }} 
                        />

                        {(menuAvatarAbierto || animandoMenuAvatar) && (
                            <div
                                ref={avatarMenuRef}
                                className={
                                    "topbar-menu " +
                                    (animandoMenuAvatar ? "cerrando" : "activo")
                                }
                            >
                                <Boton tipo="menu" onClick={() => navigate("/editar-cuenta")}>
                                    <img 
                                        src={cuentaIcono} 
                                        alt="Editar cuenta" 
                                        className="icono-opciones"
                                    />
                                    Editar cuenta
                                </Boton>

                                <Boton
                                    tipo="menu"
                                    onClick={() => {
                                        cerrarSesion();
                                        navigate("/login");
                                    }}
                                >
                                    <img 
                                        src={cerrarSesionIcono} 
                                        alt="Cerrar sesión" 
                                        className="icono-opciones"
                                    />
                                    Cerrar sesión
                                </Boton>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ====================== MENÚ MÓVIL (dropdown) ====================== */}
            <div className={`mobile-menu ${menuMovilAbierto ? "open" : ""}`} ref={mobileMenuRef}>
                <NavLink
                    to="/home"
                    className={({ isActive }) => isActive ? "active" : ""}
                    onClick={() => setMenuMovilAbierto(false)}
                >
                    <img src={homeIcono} alt="Home" className="icono-opciones" />
                    Home
                </NavLink>

                <NavLink
                    to="/calendario"
                    className={({ isActive }) => isActive ? "active" : ""}
                    onClick={() => setMenuMovilAbierto(false)}
                >
                    <img src={calendarioIcono} alt="Mi Calendario" className="icono-opciones" />
                    Mi Calendario
                </NavLink>

                <NavLink
                    to="/buscar-calendarios"
                    className={({ isActive }) => isActive ? "active" : ""}
                    onClick={() => setMenuMovilAbierto(false)}
                >
                    <img src={lupaIcono} alt="Buscar Calendario" className="icono-opciones" />
                    Buscar Calendarios
                </NavLink>
            </div>

        </header>
    );
};

export default TopBar;
