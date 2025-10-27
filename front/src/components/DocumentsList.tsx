export const DocumentList = () => {
  return (
    <div className=' bg-white p-5 rounded-md flex flex-col'>
      <h3 className='self-center max-w-3xl text-center font-medium text-[var(--font-title-light)]'>
        Si bien no todos los documentos son de carácter obligatorio, contar con información más completa agiliza
        significativamente el proceso de evaluación y resolución de su solicitud.
      </h3>
      <ul className='space-y-6 flex p-5'>
        <div>
          <li className=' p-4 rounded-lg '>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
              <span className='mr-2'>📋</span>
              Documentación Legal
            </h3>
            <ul className='space-y-2 ml-6 text-gray-600'>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Estatutos sociales / Acta constitutiva
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Inscripción en registro mercantil
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                RFC / NIF / Identificación fiscal
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Poderes de representación legal
              </li>
            </ul>
          </li>

          <li className=' p-4 rounded-lg '>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
              <span className='mr-2'>💰</span>
              Estados Financieros
            </h3>
            <ul className='space-y-2 ml-6 text-gray-600'>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Estados financieros últimos 2-3 años (balance, resultados)
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Declaraciones de impuestos últimos 2 años
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Estados de cuenta bancarios últimos 6 meses
              </li>
            </ul>
          </li>
        </div>
        <div>
          <li className=' p-4 rounded-lg '>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
              <span className='mr-2'>👤</span>
              Documentación de Representantes
            </h3>
            <ul className='space-y-2 ml-6 text-gray-600'>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Identificación oficial (DNI, pasaporte)
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Comprobante de domicilio
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                CURP / NSS / Seguridad social (según país)
              </li>
            </ul>
          </li>

          <li className=' p-4 rounded-lg '>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
              <span className='mr-2'>📊</span>
              Información del Negocio
            </h3>
            <ul className='space-y-2 ml-6 text-gray-600'>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Comprobante de antigüedad del negocio
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Facturas de servicios (luz, agua, teléfono)
              </li>
              <li className='flex items-start'>
                <span className='text-gray-400 mr-2'>•</span>
                Contratos de arrendamiento (si aplica)
              </li>
            </ul>
          </li>
        </div>

        {/* <li className=' p-4 rounded-lg '>
        <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
          <span className='mr-2'>🔍</span>
          Información Específica del Crédito
        </h3>
        <ul className='space-y-2 ml-6 text-gray-600'>
          <li className='flex items-start'>
            <span className='text-gray-400 mr-2'>•</span>
            Estados de cuenta de otros créditos
          </li>
          <li className='flex items-start'>
            <span className='text-gray-400 mr-2'>•</span>
            Garantías ofrecidas (avales, propiedades)
          </li>
          <li className='flex items-start'>
            <span className='text-gray-400 mr-2'>•</span>
            Proyecciones financieras (para montos altos)
          </li>
        </ul>
      </li> */}
      </ul>
    </div>
  )
}
