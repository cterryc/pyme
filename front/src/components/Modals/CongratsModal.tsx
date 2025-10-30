import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface CongratsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CongratsModal = ({ isOpen, onClose }: CongratsModalProps) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={true}
                    numberOfPieces={350}
                    gravity={0.25}
                    style={{ zIndex: 60, position: 'fixed', top: 0, left: 0 }}
                />
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>

                    <div className="p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            ¡Felicidades!
                        </h2>

                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-xl p-6">
                            <span className="font-semibold text-green-600">
                                Tu primera solicitud fue aprobada.
                            </span>{' '}
                            Ahora necesitas <span className="font-medium">firmar el documento</span> para culminar el proceso.
                            Puedes hacerlo desde la opción <strong>“Detalles de la solicitud”</strong>.
                            El desembolso se realizará tras la revisión final del administrador.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Continuar al proceso de firma
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.4s ease-out;
        }
      `}</style>
        </>
    );
};
