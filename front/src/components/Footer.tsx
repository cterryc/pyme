import { Link } from 'react-router-dom'
export const Footer = () => {
  return (
    <footer
      style={{ boxShadow: '0px 3px 20px 0px #9e9e9e' }}
      className='flex flex-col items-center gap-5 shadow-lg p-10 border-t-1 border-[rgba(199,199,199,1)] text-center'
    >
      <ul className='flex gap-3'>
        <li>
          <Link to='/'>Política de Privacidad</Link>
        </li>
        <li>
          <Link to='/'>Términos y condiciones</Link>
        </li>
        <li>
          <Link to='/'>Contacto</Link>
        </li>
      </ul>
      <p>@2025 Financia. Todos los derechos reservados.</p>
    </footer>
  )
}
