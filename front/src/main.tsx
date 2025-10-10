import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainRouter } from './routes/route.tsx'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' />
      <RouterProvider router={mainRouter} />
    </QueryClientProvider>
  </StrictMode>
)
