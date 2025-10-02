import { createBrowserRouter } from 'react-router-dom'
import { Landing } from '../pages/Landing'

export const mainRouter = createBrowserRouter([
  { path: '/', element: <Landing /> }
  // add pages
])
