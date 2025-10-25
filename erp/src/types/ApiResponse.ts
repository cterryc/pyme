/**
 * Interfaz genérica para la respuesta de la API. Si se desea modificar, puedes realizarlo sin ningun problema. 
 * * @template T - Tipo de datos que se espera en la respuesta.
 * 
 */

export interface ApiResponse<T> {
    error: boolean;
    message: string;
    data: T;
    errors?: {
        [key: string]: string[];
    };
    total?: number; // Opcional, para respuestas paginadas
}
export interface Pagination<T> {
    current_page: number;
    data: T[]; // Tipado generico
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
