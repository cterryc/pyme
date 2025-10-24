import { logger } from "./debug";

export const rootLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (token) {
    logger.info('Token detectado');
    localStorage.setItem('token', token);
    //window.history.replaceState({}, '', url.pathname);
    return {
      globalToken: token,
      message: 'workflow token detectado',
    };
  }
  logger.warn('No se detectó el token en el loader principal');
  //return redirect('/login')
  return {
    globalToken: null,
    message: 'No se detectó token en el loader principal',
  };
};
