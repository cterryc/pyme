import { createContext, type ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { DashboardProvider } from './DashboardProvider';
import { Toaster } from '@/components/ui/sonner';

type MainContextType = {};

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
    }, []);

    return (
        <MainContext.Provider value={{}}>
            <AuthProvider>
                <DashboardProvider>
                    {children}
                    <Toaster />
                </DashboardProvider>
            </AuthProvider>
        </MainContext.Provider>
    );
};