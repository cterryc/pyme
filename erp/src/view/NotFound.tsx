import { useState, useEffect } from 'react';
import { HomeIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';

export default function NotFound() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const goBack = () => {
        void navigate(-1);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            <div
                className={`w-full max-w-md transform text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
            >
                <div className="text-8xl font-bold text-blue-900 dark:text-blue-900/90">
                    404
                </div>

                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl leading-tight font-bold text-gray-800 dark:text-white">
                        ¡Oops! Página no encontrada
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                        La página que buscas parece haber desaparecido en el ciber espacio
                        🛰.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Puede que la URL sea incorrecta.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link to="/" className="flex-1 sm:flex-none">
                            <Button variant="outline">
                                <HomeIcon className="h-4 w-4" />
                                Ir al Inicio
                            </Button>
                        </Link>

                        <Button onClick={goBack} variant="default">
                            <RotateCcwIcon className="h-4 w-4" />
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
