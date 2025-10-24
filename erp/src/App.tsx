'use client';

import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { routes } from './routes';
import getAllRoutes from './utils/routesUtils';
import { Button } from './components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Skeleton } from './components/ui/skeleton';
import { toast } from 'sonner';
import {
    RefreshCw,
    Trash2,
    Copy,
    ChevronRight,
    Zap,
    EyeClosedIcon,
    EyeIcon,
} from 'lucide-react';
import WhatsAppIcon from './components/icons/WhatsAppIcon';
import GitHubIcon from './components/icons/GithubIcon';

function App() {
    const flattenedRoutes = getAllRoutes(routes, '/');
    const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
    const [isGeneratingToken, setIsGeneratingToken] = useState(false);
    const [currentToken, setCurrentToken] = useState<string | null>(null);

    const [showValue, setShowValue] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setCurrentToken(tokenFromUrl);
            localStorage.setItem('token', tokenFromUrl);
        } else {
            const tokenFromStorage = localStorage.getItem('token');
            if (tokenFromStorage) {
                setCurrentToken(tokenFromStorage);
            } else {
                setCurrentToken(null);
            }
        }
    }, []);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'token') {
                setCurrentToken(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);
    
    const getEnvironmentInfo = () => {
        return {
            apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
            username: import.meta.env.VITE_USERNAME_DEV || 'Desconocido',
            password: import.meta.env.VITE_USER_PASSWORD_DEV || 'Desconocido',
            dev: import.meta.env.DEV,
            prod: import.meta.env.PROD,
        };
    };

    const generateToken = async () => {
        setIsGeneratingToken(true);
        try {
            const response = await fetch(
                getEnvironmentInfo().apiUrl + '/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: getEnvironmentInfo().username,
                        user_id: getEnvironmentInfo().password,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error al generar el token: ${response.status} ${response.statusText}`
                );
            }
            const { data } = await response.json();
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('token', data.token);
            window.history.pushState({}, '', newUrl.toString());

            if (data.token == null) {
                return toast.error('No se pudo generar el token ☠️', {
                    description:
                        'No se pudo generar el token. Revisa la consola para más detalles.',
                });
            }

            setCurrentToken(data.token);
            localStorage.setItem('token', data.token);
            toast.success('Token generado', {
                description: 'El token se ha agregado.',
            });
        } catch (error) {
            toast.error('Error al generar el token ☠️', {
                description:
                    'No se pudo generar el token. Revisa la consola para más detalles.',
            });
        } finally {
            setIsGeneratingToken(false);
        }
    };

    const clearUrlToken = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('token');
        window.history.pushState({}, '', newUrl.toString());
    };

    const clearTokenLocalStorage = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        clearUrlToken();
    };

    const clearToken = () => {
        setCurrentToken(null);
        clearUrlToken();
        clearTokenLocalStorage();
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast('Copiado 📋');
    };

    const openWhatsAppSupport = () => {
        const phoneNumber = '';
        const message = encodeURIComponent(
            'Hola, necesito soporte con el sistema ERP PYME'
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    if (!IS_DEVELOPMENT) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <Card className="mx-auto w-96 shadow-xl">
                    <CardHeader className="pb-4 text-center">
                        <div className="mx-auto mb-4 h-20 w-20 overflow-hidden p-2">
                            <img
                                src="/logo.png"
                                alt="Logo PYME"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            ERP PYME
                        </CardTitle>
                        <CardDescription className="text-lg leading-relaxed">
                            Bienvenido al sistema ERP PYME. Plataforma empresarial
                            integrada para la gestión eficiente de recursos y procesos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <div>
                            <Button
                                onClick={openWhatsAppSupport}
                                variant="outline"
                                size="lg"
                                className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                                <WhatsAppIcon className="mr-2 size-7" />
                                Soporte WhatsApp
                            </Button>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Version Producción v0.1.1
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <header className="border-b bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-white p-1 shadow-sm">
                                <img
                                    src="/logo.png"
                                    alt="Logo PYME"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    ERP PYME
                                </h1>
                                <p className="text-muted-foreground text-sm">
                                    Entorno de Desarrollo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700"
                            >
                                {import.meta.env.MODE}
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Bienvenido al Entorno de Desarrollo 🧑‍💻
                                </CardTitle>
                                <CardDescription>
                                    Esta plataforma contiene todos los módulos necesarios para
                                    el desarrollo y prueba del sistema ERP PYME.{' '}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild>
                                        <a
                                            href="https://github.com/cterryc/pyme"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <GitHubIcon className="mr-2 size-5" />
                                            Ver Repositorio
                                        </a>
                                    </Button>
                                    <Button
                                        onClick={generateToken}
                                        disabled={isGeneratingToken}
                                        variant="outline"
                                    >
                                        {isGeneratingToken ? (
                                            <RefreshCw className="mr-2 size-5 animate-spin" />
                                        ) : (
                                            <Zap className="mr-2 size-5" />
                                        )}
                                        {isGeneratingToken ? 'Generando...' : 'Generar Token'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {(currentToken || isGeneratingToken) && (
                            <Alert className="border-green-200 bg-green-50">
                                <Zap className="size-5 text-green-600" />
                                <AlertDescription>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="mb-1 font-medium text-green-800">
                                                Token Activo
                                            </p>
                                            {isGeneratingToken ? (
                                                <Skeleton className="my-1 h-6 w-full max-w-xs" />
                                            ) : (
                                                <p className="font-mono text-sm break-all text-green-700">
                                                    {String(currentToken).substring(0, 80)}***
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-4 flex space-x-1">
                                            {isGeneratingToken ? (
                                                <Skeleton className="h-8 w-8" />
                                            ) : (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(currentToken || '')}
                                                        className="h-8 w-8 text-green-600 hover:text-green-800"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={clearToken}
                                                        className="h-8 w-8 text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Módulos Disponibles 🧩</span>
                                </CardTitle>
                                <CardDescription>
                                    Lista de todos los módulos y rutas disponibles en el sistema
                                </CardDescription>
                                <CardAction>
                                    <Badge variant="secondary">
                                        {
                                            flattenedRoutes.filter(
                                                (route) =>
                                                    route.Component && route.path && route.id !== 'root'
                                            ).length
                                        }
                                    </Badge>{' '}
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {flattenedRoutes.map(
                                        (route, index) =>
                                            route.Component &&
                                            route.path &&
                                            route.id !== 'root' && (
                                                <Button
                                                    key={index}
                                                    asChild
                                                    variant="ghost"
                                                    className="h-auto w-full justify-between border border-transparent p-4 hover:border-blue-200 hover:bg-blue-50"
                                                    onClick={(e) => {
                                                        if (!currentToken || currentToken === '') {
                                                            e.preventDefault();
                                                            toast.error(
                                                                'No tienes un token activo. Genera uno para acceder a los módulos.'
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Link to={route.path}>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                            <span className="font-medium">{route.path}</span>
                                                        </div>
                                                        <ChevronRight className="text-muted-foreground size-5" />
                                                    </Link>
                                                </Button>
                                            )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Acciones Rápidas⚡</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={clearToken}
                                    className="w-full justify-start"
                                >
                                    <Trash2 className="mr-2 size-5" />
                                    Limpiar Token
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="w-full justify-start"
                                >
                                    <RefreshCw className="mr-2 size-5" />
                                    Recargar Página
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Información del Entorno 📦
                                </CardTitle>
                                <CardAction>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowValue((prev) => !prev);
                                        }}
                                        className="ml-1 size-6"
                                    >
                                        {showValue ? (
                                            <EyeIcon className="text-muted-foreground size-5" />
                                        ) : (
                                            <EyeClosedIcon className="text-muted-foreground size-5" />
                                        )}
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(getEnvironmentInfo()).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-muted-foreground text-sm capitalize">
                                                {key}:
                                            </span>
                                            <div className="flex items-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`font-mono text-xs ${showValue ? '' : 'blur-sm transition-all select-none hover:blur-none'}`}
                                                >
                                                    {typeof value === 'string'
                                                        ? `${String(value).substring(0, 4)}***`
                                                        : String(value)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
