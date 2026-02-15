// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import React, { useState } from "react";
import "../../estilos/PopUp/PopupConfirmacion.css";

//Imports propios
import Cropper from "react-easy-crop";
import Boton from "../Boton";


// ======================================================================
// ============== VARIABLES DE ENTRADA AL COMPONENTE ====================
// ======================================================================
interface Props {
    imagen: string;
    onCancelar: () => void;
    onRecortar: (base64: string) => void;
}


// ======================================================================
// ========================= Funciones Globales =========================
// ======================================================================
function getCroppedImg(imageSrc: string, cropPixels: any): Promise<string> {
    const image = new Image();
    image.src = imageSrc;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise(resolve => {
        image.onload = () => {
            canvas.width = cropPixels.width;
            canvas.height = cropPixels.height;

            ctx!.drawImage(
                image,
                cropPixels.x, cropPixels.y,
                cropPixels.width, cropPixels.height,
                0, 0,
                cropPixels.width, cropPixels.height
            );

            resolve(canvas.toDataURL("image/jpeg"));
        };
    });
}



// ======================================================================
// ========================== COMPONENTE ================================
// ======================================================================
const PopupRecorteImagen: React.FC<Props> = ({ imagen, onCancelar, onRecortar }) => {

// ======================================================================
// ========== Variables de Estado del componente ========================
// ======================================================================
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [recorte, setRecorte] = useState<any>(null);


// ======================================================================
// ========================== Funciones  ================================
// ======================================================================
    async function aplicarRecorte() {
        const base64 = await getCroppedImg(imagen, recorte);
        onRecortar(base64);
    }

    
// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
    return (
        <div className="popup-overlay">
            <div className="popup-contenedor" style={{ width: "32rem", height: "34rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Recortar imagen</h3>

                <div style={{ position: "relative", width: "100%", height: "22rem" }}>
                    <Cropper
                        image={imagen}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(a, b) => setRecorte(b)}
                    />
                </div>

                <div className="popup-botones">
                    <Boton tipo="mini" onClick={onCancelar}>Cancelar</Boton>
                    <Boton tipo="primario" onClick={aplicarRecorte}>
                        Aplicar recorte
                    </Boton>
                </div>
            </div>
        </div>
    );
};

export default PopupRecorteImagen;
