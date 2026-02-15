// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================

//Imports Basicos
import React, { useState } from "react";
import "../estilos/TopBar/EditarCuenta.css";
import Multimedia from "../componentes/Externos/Multimedia";
import { editarUsuario } from "../services/KalendasService";

//Imports propios
import Boton from "../componentes/Boton";
import { useUsuario } from "../contextos/UsuarioContext";
import avatar from "../imagenes/Avatar.jpg";
import ConfirmacionPopUp from "../componentes/PopUp/ConfirmacionPopUp"; 


// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const EditarCuenta: React.FC = () => {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================
    // Estados para controlar los datos editables del usuario

    const { usuario, actualizarUsuario  } = useUsuario();  // crear el contexto de usuario con sus datos

    const [alias, setAlias] = useState(usuario?.alias ?? "");
    const [email, setEmail] = useState(usuario?.email ?? "");
    const [foto, setFoto] = useState(usuario?.foto ?? "");
    // Estado para bloquear el botón de guardar si se está subiendo imagen
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [recibirNotificaciones, setRecibirNotificaciones] = useState(usuario?.recibirNotificaciones ?? true);
    const [mostrarPopup, setMostrarPopup] = useState(false);

    
// ======================================================================
// ========================== Funciones  ================================
// ======================================================================
// Función adaptadora: Multimedia devuelve un array, nosotros queremos solo la última foto
    const handleFotoChange = (newUrls: string[]) => {
        if (newUrls.length > 0) {
            // Si hay fotos, cogemos la última que se haya añadido (reemplazo)
            setFoto(newUrls[newUrls.length - 1]);
            console.log("Nueva foto de perfil:", foto);
        } else {
            // Si han borrado todas, se queda vacío
            setFoto("");
        }
    };
    // GUARDAR CAMBIOS
    const handleGuardar = async () => {
        // 1. Validaciones básicas
        if (!usuario?._id) {
            alert("Error: No se ha identificado al usuario.");
            return;
        }
        if (!alias.trim() || !email.trim()) {
            alert("El alias y el correo son obligatorios.");
            return;
        }

        // 2. Preparar los datos a enviar
        // (Asegúrate de que los nombres de los campos coincidan con lo que espera tu Backend/DTO)
        const datosAActualizar = {
            alias: alias,
            email: email,
            foto: foto,
            recibirNotificaciones: recibirNotificaciones === true
        };

        setGuardando(true);

        try {
            // 3. Llamada al servicio
            const usuarioActualizado = await editarUsuario(usuario._id, datosAActualizar); 
            actualizarUsuario (usuarioActualizado);
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
            setMostrarPopup(true);

        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert("Hubo un error al guardar los cambios.");
        } finally {
            
            setGuardando(false);
        }
    };
// ======================================================================
// ========================== Return (HTML de respuesta) ================
// ======================================================================
     return (
        <>
        {/* CABECERA COMPACTA */}
        <div className="editar-header-mini centered">
            <h1>Editar Cuenta</h1>
            <p>Actualiza tu alias, correo y foto de perfil.</p>
        </div>
        <div className="editar-wrapper">

            <div className="editar-card">

                {/* Avatar (si hay foto) */}
                <div className="editar-avatar-container">
                    <img
                        src={foto || avatar}
                        alt="Avatar"
                        className="editar-avatar"
                    />
                </div>

                <h2 className="editar-titulo">Editar datos de tu cuenta</h2>
                <p className="editar-subtitulo">
                    Personaliza tu perfil y mantén tu información actualizada.
                </p>

                {/* FORMULARIO */}
                <div className="editar-form">

                    <label>Alias</label>
                    <input
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="Tu nombre visible"
                    />

                    <label>Correo electrónico</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@correo.com"
                        type="email"
                    />

                    {/* INTERRUPTOR RECIBIR NOTIFICACIONES */}
                    <div className="toggle-row">
                        <span>Recibir notificaciones</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                // --- CAMBIAR ESTAS DOS LÍNEAS ---
                                checked={recibirNotificaciones}
                                onChange={(e) => setRecibirNotificaciones(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>


                    {/* FOTO DE PERFIL */}
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <label style={{fontWeight: 'bold', display:'block', marginBottom:'5px'}}>Foto de Perfil</label>
                        
                        <Multimedia 
                            urls={foto ? [foto] : []}
                            editable={true}
                            onChange={handleFotoChange}
                            onUploadStatusChange={setSubiendoFoto}
                            acceptedFileTypes="image/*" 
                            allowMultiple={false}
                        />
                        
                        <p style={{ fontSize: '0.8em', color: 'var(--blanco)', marginTop: '5px' }}>
                            * Al subir una nueva foto, se reemplazará la anterior.
                        </p>
                    </div>



                    <div className="editar-botones">
                        <Boton 
                            tipo="primario" 
                            disabled={subiendoFoto || guardando}
                            onClick={handleGuardar} 
                        >
                            {subiendoFoto ? "Subiendo foto..." : (guardando ? "Guardando..." : "Guardar cambios")}
                        </Boton>
                    </div>
                </div>

            </div>
        </div>
            {/* POPUP DE CONFIRMACIÓN */}
            {mostrarPopup && (
                <ConfirmacionPopUp
                    mensaje="Se han actualizado los datos de tu cuenta correctamente."
                    onAceptar={() => setMostrarPopup(false)}
                    textoAceptar="Aceptar"
                    textoCancelar=""  
                />
            )} 
         </>
    );
};


export default EditarCuenta;
