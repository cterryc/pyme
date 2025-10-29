import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainRouter } from './routes/route.tsx'
import { Toaster } from 'sonner'
import { InactivityModal } from './components/Modals/InactivityModal.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
      <InactivityModal>
        <Toaster 
          position='top-center' 
          closeButton
          visibleToasts={3}
          richColors
          expand={false}
          duration={4000}
        />
        <RouterProvider router={mainRouter} />
      </InactivityModal>
    </QueryClientProvider>
)
