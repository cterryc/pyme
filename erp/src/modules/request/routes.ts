import { type RouteObject } from 'react-router';
import RequestList from './submodules/requestList/Index';

export const requestRoutes: RouteObject[] = [
    {
        path: 'requests',
        children: [
            {
                path: 'list',
                Component: RequestList,
            },
        ],
    },
];