/**
 * Servicio para manejar la subida de imágenes a Cloudinary
 * Configurado para Create React App
 */

// 1. Accedemos a las variables de entorno usando process.env
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const PRESET_UPLOAD = process.env.REACT_APP_CLOUDINARY_PRESET;
const API_URL = process.env.REACT_APP_MULTIMEDIA_API!;


// Definimos la respuesta que esperamos de Cloudinary
// Nota: Las propiedades internas (secure_url, public_id) se mantienen en inglés
// porque así es como las devuelve la API de Cloudinary.
interface RespuestaCloudinary {
  secure_url: string; // La URL https
  public_id: string;  // El ID único de la imagen
  created_at: string;
  bytes: number;
  [key: string]: any;
}

/**
 * Sube un archivo individual a Cloudinary.
 * @param archivo El archivo seleccionado por el usuario.
 * @returns La URL pública (secure_url) de la imagen.
 */
export const subirACloudinary = async (archivo: File): Promise<string> => {
  // Validación básica
  if (!CLOUD_NAME || !PRESET_UPLOAD) {
    throw new Error('Faltan configurar las variables de entorno REACT_APP_CLOUDINARY...');
  }

  const datosFormulario = new FormData();
  datosFormulario.append('file', archivo);
  datosFormulario.append('upload_preset', PRESET_UPLOAD);

  try {
    const respuesta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: datosFormulario,
      }
    );

    if (!respuesta.ok) {
      const detalleError = await respuesta.json();
      throw new Error(detalleError.error?.message || 'Error desconocido al subir imagen');
    }

    const datos: RespuestaCloudinary = await respuesta.json();

    // Retornamos la URL segura.
    return datos.secure_url;

  } catch (error) {
    console.error('Error en ServicioMultimedia:', error);
    throw error;
  }
};

/**
 * Sube múltiples archivos simultáneamente.
 * @param archivos Lista de archivos (FileList o array de File)
 * @returns Array de strings con las URLs
 */
export const subirMultiplesImagenes = async (archivos: FileList | File[]): Promise<string[]> => {
  // Convertimos FileList a Array normal para poder usar map
  const listaArchivos = Array.from(archivos);

  // Creamos un array de promesas (todas las subidas se inician a la vez)
  const promesasSubida = listaArchivos.map((archivo) => subirACloudinary(archivo));

  // Esperamos a que TODAS terminen
  const urls = await Promise.all(promesasSubida);
  
  return urls;
};

// ... (código anterior del servicio) ...

/**
 * Extrae el 'public_id' necesario para borrar desde la URL de Cloudinary.
 * Maneja URLs con o sin versionado (v1234...).
 */
const obtenerPublicId = (url: string): string | null => {
  // Busca el texto entre "/upload/" (ignorando la versión v...) y la extensión del archivo
  const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// ... imports y otras funciones ...

// 1. Actualiza la URL (si es necesario)
// Nota: Asegúrate de que coincida con tu server.js (http://localhost:3001/multimedia/)
export const eliminarDeCloudinary = async (url: string): Promise<void> => {
  const publicId = obtenerPublicId(url);
  
  if (!publicId) {
    console.error('No se pudo obtener el ID de la imagen');
    return;
  }

  try {
    const respuesta = await fetch(API_URL, {
      method: 'DELETE', // <--- CAMBIO IMPORTANTE: Ahora es DELETE
      headers: {
        'Content-Type': 'application/json',
      },
      // En Express está permitido enviar body en un DELETE, 
      // así que mantenemos el public_id aquí.
      body: JSON.stringify({ public_id: publicId }), 
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.error || 'Error en el servidor');
    }
    
    console.log('Imagen borrada via microservicio');

  } catch (error) {
    console.error('Error en eliminarDeCloudinary:', error);
    throw error;
  }
};
