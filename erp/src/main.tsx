import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { MainProvider } from './context/MainProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MainProvider>
        <RouterProvider router={router} />
      </MainProvider>
  </StrictMode>,
)
