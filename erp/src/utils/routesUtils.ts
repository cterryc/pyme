interface FlatRoute {
    id: string;
    name: string;
    path: string;
    Component?: React.ComponentType | null;
    element?: React.ReactNode | null;
    children?: FlatRoute[];
}

export default function getAllRoutes(
    routes: any[],
    parentPath = ''
): FlatRoute[] {
    return routes.flatMap((route) => {
        const currentPath = route.path
            ? `${parentPath}/${route.path}`.replace(/\/\/+/g, '/')
            : parentPath;

        const currentRoute: FlatRoute = {
            id: route.id,
            name: route.name || '',
            path: currentPath,
            Component: route.Component || null,
            element: route.element || null,
        };

        const childrenRoutes = route.children
            ? getAllRoutes(route.children, currentPath)
            : [];

        return [currentRoute, ...childrenRoutes];
    });
}
