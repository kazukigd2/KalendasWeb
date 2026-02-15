// src/contextos/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  GithubAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';

import { auth, googleProvider, githubProvider } from '../services/firebase';
// Solo importamos la sincronización básica, nada de calendarios
import { sincronizarUsuario } from '../services/KalendasService'; 
import { UsuarioLoginDTO } from 'schemas/KalendasSchemas';
// import { useUsuario } from './UsuarioContext';
// const { actualizarUsuario } = useUsuario();


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setAuthLoading(false);
  });
  return unsub;
}, []);

  // --- LOGIN CON GOOGLE ---
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      
      // 4. OBTENER Y GUARDAR TOKEN (Importante para tu botón)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (result.user && accessToken) {
          localStorage.setItem("provider_token", accessToken);
          console.log("Token guardado con scope:", accessToken); // Para debug
      }
      if (result.user) {
        const datosParaBackend: UsuarioLoginDTO  = {
            id: result.user.uid,
            email: result.user.email || "no-email@google.com", 
            alias: result.user.displayName,
            foto: result.user.photoURL,
            provider_token: accessToken || null
        };
        // Solo sincronizamos (Login/Registro en Mongo)
        await sincronizarUsuario(datosParaBackend);
        localStorage.setItem("logueado", "true");
        // actualizarUsuario(usuario);
      }
    } catch (error) {
      console.error("Error en login Google:", error);
    }
  };

  // --- LOGIN CON GITHUB ---
  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();

      const result = await signInWithPopup(auth, githubProvider);

      // Obtener token de GitHub
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (result.user) {
        const datosParaBackend = {
            id: result.user.uid,
            email: result.user.email || `${result.user.uid}@noreply.github.com`,
            alias: result.user.displayName || "Usuario GitHub",
            foto: result.user.photoURL,
            provider_token: accessToken || null
        };
        // Solo sincronizamos (Login/Registro en Mongo)
        await sincronizarUsuario(datosParaBackend);
        localStorage.setItem("logueado", "true");
        // actualizarUsuario(usuario);

      }
    } catch (error) {
      console.error("Error en login GitHub:", error);
    }
  };

  // --- LOGOUT ---
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  // --- OBSERVADOR ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user, 
        loading,
        signInWithGoogle, 
        signInWithGithub, 
        logOut 
    }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};