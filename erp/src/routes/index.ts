import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const App = lazy(() => import('../App'));
const NotFound = lazy(() => import('../view/NotFound'));
const LayoutApp = lazy(() => import('../components/layout/LayoutApp'));
const LayoutBasic = lazy(() => import('../components/layout/LayoutBasic'));
const DashboardView = lazy(() => import('../view/Dashboard'));
import { rootLoader } from '@/utils/rootLoader';
import { systemRoutes } from '@/modules/system/routes';
import { userRoutes } from '@/modules/user/routes';
import { requestRoutes } from '@/modules/request/routes';
import { pymesRoutes } from '@/modules/mypes/routes';

export const routes = [
  // Rutas sin LeftDashboard (Layout Básico)
  {
    path: '/',
    id: 'basic-layout',
    Component: LayoutBasic,
    children: [
      { index: true, Component: App },
      { path: '*', Component: NotFound },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            Component: lazy(() => import('@/view/Login')),
          }
        ],
      }
    ],
  },
  // Rutas con LeftDashboard (Layout con Dashboard)
  {
    path: '/',
    id: 'dashboard-layout',
    Component: LayoutApp,
    loader: rootLoader,
    children: [
      { path: 'dashboard', Component: DashboardView },
      ...systemRoutes,
      ...userRoutes,
      ...requestRoutes,
      ...pymesRoutes,
    ],
  },
];

export const router = createBrowserRouter(routes);
