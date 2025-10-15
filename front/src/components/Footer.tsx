import { Link } from 'react-router-dom'
export const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-2 p-4 border-t border-[rgba(199,199,199,1)] text-center">
      <ul className="flex gap-3 text-sm">
        <li>
          <Link to="/">Política de Privacidad</Link>
        </li>
        <li>
          <Link to="/">Términos y condiciones</Link>
        </li>
        <li>
          <Link to="/">Contacto</Link>
        </li>
      </ul>
      <p className="text-xs">@2025 Financia. Todos los derechos reservados.</p>
    </footer>

  )
}
