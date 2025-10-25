import { type RouteObject } from 'react-router';
import PymesList from './submodules/pymesList/Index';

export const pymesRoutes: RouteObject[] = [
    {
        path: 'pymes',
        children: [
            {
                path: 'list',
                Component: PymesList,
            },
        ],
    },
];