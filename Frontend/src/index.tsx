// ======================================================================
// ========================= IMPORTS ====================================
// ======================================================================
//Imports Basicos
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './estilos/index.css';

//Imports propios
import App from './App';
import { UsuarioProvider } from "./contextos/UsuarioContext";
import { AuthProvider } from './contextos/AuthContext';

// ======================================================================
// ===================== Return (HTML de respuesta) =====================
// ======================================================================
const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement as HTMLElement);
    root.render(
        //<React.StrictMode>
        <AuthProvider>
             <UsuarioProvider>
                <App />
             </UsuarioProvider>
        </AuthProvider>
        //</React.StrictMode>
    );
} else {
    console.error("No se encontro el elemento con id 'root'");
}
