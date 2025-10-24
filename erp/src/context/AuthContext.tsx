import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

interface User {
  username: string;
  // Agrega más campos según tu necesidad
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setTokenState(storedToken);
      // Aquí podrías validar el token con el backend
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await authService.validateToken(tokenToValidate);
      if (!response.error && response.data.valid) {
        // Token válido, podrías obtener info del usuario aquí
        setTokenState(tokenToValidate);
      } else {
        // Token inválido, limpiar
        localStorage.removeItem('token');
        setTokenState(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('token');
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      
      if (!response.error && response.data.token) {
        const newToken = response.data.token;
        
        // Guardar token en localStorage
        localStorage.setItem('token', newToken);
        setTokenState(newToken);
        
        // Establecer usuario (aquí podrías decodificar el JWT o hacer otra petición)
        setUser({ username });
        
        toast.success('Inicio de sesión exitoso', {
          description: `Bienvenido, ${username}`,
        });
      } else {
        toast.error('Error al iniciar sesión', {
          description: response.message || 'Credenciales inválidas',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión', {
        description: 'Ocurrió un error al intentar iniciar sesión',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setTokenState(null);
    setUser(null);
    toast.info('Sesión cerrada', {
      description: 'Has cerrado sesión correctamente',
    });
  };

  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
