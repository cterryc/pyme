import { MdKeyboardArrowDown } from "react-icons/md";

export const UserCreditRequests = () => {
  const tableHeaders = ['ID Solicitud', 'Nombre Pyme', 'Monto Solicitado', 'Fecha', 'Estado']

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Solicitudes de crédito registradas</h2>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-max border-collapse w-full">
          <thead className="text-gray-400 text-left">
            <tr className="border-b-2 border-gray-200">
              {tableHeaders.map(header => (
                <th key={header} className="p-3 min-w-40">
                  <div className='flex items-center gap-1'>
                    {header} <MdKeyboardArrowDown className='mt-1 w-6 h-6 cursor-pointer' />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200">
              <td className="p-3">#1DWA295</td>
              <td className="p-3">Nombre Legal</td>
              <td className="p-3">$10.000</td>
              <td className="p-3">20 de Mayo, 2025</td>
              <td className="p-3">
                <span className={`inline-block rounded-full px-6 py-2 text-white bg-green-500`}>
                  Aprobado
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200">
              <td className="p-3">#1DWA295</td>
              <td className="p-3">Nombre Legal</td>
              <td className="p-3">$10.000</td>
              <td className="p-3">20 de Mayo, 2025</td>
              <td className="p-3">
                <span className={`inline-block rounded-full px-6 py-2 text-white bg-red-400`}>
                  Rechazado
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200">
              <td className="p-3">#1DWA295</td>
              <td className="p-3">Nombre Legal</td>
              <td className="p-3">$10.000</td>
              <td className="p-3">20 de Mayo, 2025</td>
              <td className="p-3">
                <span className={`inline-block rounded-full px-6 py-2 text-white bg-blue-400`}>
                  En revision
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
