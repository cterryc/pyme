import { lazy } from 'react';
import { type RouteObject } from 'react-router';

export const systemRoutes: RouteObject[] = [
    {
        path: 'system',
        children: [
            {
                path: 'config',
                Component: lazy(() => import('./submodules/config')),
            },
        ],
    },
];