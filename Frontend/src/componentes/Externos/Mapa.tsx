// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    OpenLayers: any;
  }
}

// ======================================================================
// ========================= INTERFACES =================================
// ======================================================================
interface MapaProps {
  latitud?: number;
  longitud?: number;
  zoom?: number;
  onCoordenadasChange?: (lat: number, lon: number) => void;
  editable?: boolean; 
}

// ======================================================================
// ========================= COMPONENTE =================================
// ======================================================================
const Mapa: React.FC<MapaProps> = ({ 
    latitud, 
    longitud, 
    zoom = 14, 
    onCoordenadasChange,
    editable = false 
}) => {
  
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  // Estado para el buscador
  const [busqueda, setBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);

  const DEFAULT_LAT = 36.7213; 
  const DEFAULT_LON = -4.4216;

  // 1. Cargar script OpenLayers
  useEffect(() => {
    if (window.OpenLayers) {
      iniciarMapa();
      return;
    }
    const scriptId = 'openlayers-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.13.1/OpenLayers.js";
      script.async = true;
      script.onload = () => iniciarMapa();
      document.body.appendChild(script);
    }
  }, []);

  // 2. Actualizar posición desde props
  useEffect(() => {
    if (window.OpenLayers && mapInstance.current) {
      actualizarPosicion(latitud, longitud);
    }
  }, [latitud, longitud, zoom]);

  // ===================================================================
  // === FIX 1: Forzar redraw cuando el mapa se monta ==================
  // ===================================================================
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => {
        mapInstance.current.updateSize();
      }, 50);
    }
  }, []);

  // ===================================================================
  // === FIX 2: Forzar redraw cuando cambian coords ====================
  // ===================================================================
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.updateSize();
    }
  }, [latitud, longitud]);

  // ===================================================================
  // === FIX 3: Bloquear scroll página y permitir zoom con rueda =======
  // ===================================================================
  useEffect(() => {
    const div = mapDivRef.current;
    if (!div) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Bloquea scroll página
    };

    const enter = () => {
      div.addEventListener("wheel", handleWheel, { passive: false });
    };

    const leave = () => {
      div.removeEventListener("wheel", handleWheel);
    };

    div.addEventListener("mouseenter", enter);
    div.addEventListener("mouseleave", leave);

    return () => {
      div.removeEventListener("mouseenter", enter);
      div.removeEventListener("mouseleave", leave);
      div.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // --- LÓGICA MAPA ---
  const iniciarMapa = () => {
    if (!mapDivRef.current || !window.OpenLayers) return;
    if (mapInstance.current) return;

    mapDivRef.current.innerHTML = '';
    const OpenLayers = window.OpenLayers;

    // Configuración para quitar atribución molesta
    const mapOptions = {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoom(),
        ],
        numZoomLevels: 20
    };

    const map = new OpenLayers.Map(mapDivRef.current, mapOptions);
    map.addLayer(new OpenLayers.Layer.OSM());

    const markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    mapInstance.current = map;
    markersLayer.current = markers;

    // =========================================================
    // === REGISTRO DE EVENTO CLICK (OpenLayers 2) ===
    // =========================================================
    if (editable) {
        map.events.register("click", map, function(e: any) {
            var lonlat = map.getLonLatFromPixel(e.xy);
            
            var transformed = lonlat.clone().transform(
                map.getProjectionObject(), 
                new OpenLayers.Projection("EPSG:4326")
            );

            if (onCoordenadasChange) {
                onCoordenadasChange(transformed.lat, transformed.lon);
            }
        });
    }

    actualizarPosicion(latitud, longitud);
  };

  const actualizarPosicion = (lat?: number, lon?: number) => {
    const OpenLayers = window.OpenLayers;
    if (!OpenLayers || !mapInstance.current) return;

    markersLayer.current.clearMarkers();

    const hayCoordenadas = lat !== undefined && lon !== undefined;
    const latDestino = hayCoordenadas ? lat : DEFAULT_LAT;
    const lonDestino = hayCoordenadas ? lon : DEFAULT_LON;
    const zoomDestino = hayCoordenadas ? zoom : 12; 

    const lonLat = new OpenLayers.LonLat(lonDestino, latDestino)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), 
        mapInstance.current.getProjectionObject()
      );

    if (hayCoordenadas) {
        markersLayer.current.addMarker(new OpenLayers.Marker(lonLat));
    }

    mapInstance.current.setCenter(lonLat, zoomDestino);
  };

  // --- BUSCADOR ---
  const handleBuscarLugar = async () => {
      if (!busqueda.trim()) return;
      
      setBuscando(true);
      try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(busqueda)}&format=json&addressdetails=1&limit=1`;
          const res = await fetch(url);
          const data = await res.json();

          if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              
              if (onCoordenadasChange) {
                  onCoordenadasChange(lat, lon);
              }
          } else {
              alert("No se encontró el lugar.");
          }
      } catch (error) {
          console.error("Error buscando lugar:", error);
          alert("Error al conectar con el servicio de mapas.");
      } finally {
          setBuscando(false);
      }
  };

  const hayDatos = latitud !== undefined && longitud !== undefined;

  return (
    <div style={{ width: "100%", marginBottom: "15px" }}>
      
      {/* BARRA DE BÚSQUEDA */}
      {editable && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input 
                  type="text" 
                  placeholder="Buscar ciudad (ej: Sevilla)..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarLugar()}
                  style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <button 
                  onClick={handleBuscarLugar}
                  disabled={buscando}
                  style={{ 
                      padding: "8px 15px", 
                      borderRadius: "4px", 
                      border: "none", 
                      backgroundColor: "#007bff", 
                      color: "white", 
                      cursor: "pointer",
                      opacity: buscando ? 0.7 : 1
                  }}
              >
                  {buscando ? "..." : "Buscar"}
              </button>
          </div>
      )}

      {/* MAPA */}
      <div 
        ref={mapDivRef}
        style={{ 
          width: "100%", 
          height: "250px", 
          border: "1px solid #ccc",
          borderRadius: "8px 8px 0 0", 
          backgroundColor: "#f0f0f0",
          overflow: "hidden", 
          position: "relative",
          cursor: editable ? "crosshair" : "default"
        }} 
      />

      {/* INFO */}
      <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          fontSize: "0.85rem",
          color: "#555",
          fontFamily: "monospace"
      }}>
          {hayDatos ? (
            <>
                <span><strong>Lat:</strong> {latitud?.toFixed(6)}</span>
                <span><strong>Lon:</strong> {longitud?.toFixed(6)}</span>
            </>
          ) : (
            <span style={{fontStyle: 'italic', color: '#999'}}>
                {editable ? "Busca o haz clic en el mapa..." : "Sin ubicación definida..."}
            </span>
          )}
      </div>

    </div>
  );
};

export default Mapa;
