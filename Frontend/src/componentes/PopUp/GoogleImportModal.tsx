import React from 'react';
import Boton from '../Boton'; 

// Importamos los estilos generales del popup (para la estructura externa)
import "../../estilos/PopUp/CalendarioPopUp.css";
// Importamos los estilos específicos para este modal (para las filas oscuras)
import "../../estilos/PopUp/GoogleImportModal.css";

interface GoogleImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    calendarios: any[];
    onSelect: (id: string, name: string) => void;
    loading: boolean;
}

const GoogleImportModal: React.FC<GoogleImportModalProps> = ({ 
    isOpen, onClose, calendarios, onSelect, loading 
}) => {
    if (!isOpen) return null;

    return (
        <div className="cal-popup-overlay" onClick={onClose}>
            
            {/* Usamos la misma clase 'cal-popup-card' para mantener el fondo --quinto */}
            <div className="cal-popup-card" onClick={(e) => e.stopPropagation()}>
                
                {/* CABECERA */}
                <div className="cal-popup-header">
                    <h2>Importar desde Google</h2>
                    <button className="cal-popup-close" onClick={onClose}>✕</button>
                </div>

                {/* CONTENIDO CON SCROLL */}
                <div className="cal-popup-scroll">
                    
                    <p className="google-description">
                        Selecciona el calendario que deseas importar a Kalendas:
                    </p>

                    {loading ? (
                        <div className="google-loading">
                            Cargando lista de calendarios...
                        </div>
                    ) : (
                        <div className="google-list-container">
                            {calendarios.length === 0 ? (
                                <p className="google-empty">No se encontraron calendarios disponibles.</p>
                            ) : (
                                calendarios.map((cal) => (
                                    <div key={cal.id} className="google-calendar-item">
                                        
                                        <div className="google-cal-info">
                                            <span className="google-cal-name" title={cal.summary}>
                                                {cal.summary}
                                            </span>
                                            
                                            {cal.primary && (
                                                <span className="google-cal-primary">
                                                    ● Principal
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div style={{ flexShrink: 0 }}>
                                            <Boton onClick={() => onSelect(cal.id, cal.summary)}>
                                                Importar
                                            </Boton>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                
                {/* PIE DEL POPUP */}
                <div className="cal-popup-actions">
                    <Boton tipo="mini-rojo" onClick={onClose}>Cancelar</Boton>
                </div>

            </div>
        </div>
    );
};

export default GoogleImportModal;