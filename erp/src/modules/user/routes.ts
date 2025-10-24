import { type RouteObject } from 'react-router';
import UserList from './submodules/usersList/Index';

export const userRoutes: RouteObject[] = [
    {
        path: 'clients',
        children: [
            {
                path: 'list',
                Component: UserList,
            },
        ],
    },
];