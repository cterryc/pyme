import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FaUser, FaBuilding } from "react-icons/fa";


export const UserDashboard = () => {
  const pymesOfTheUser = [
    {
      id: 1,
      isOwner: 'John Doe',
      legalName: "TechNova S.A.",
      taxId: "20-12345678-9",
      email: "contacto@technova.com",
      companySector: "Tecnología e Innovación"
    },
    {
      id: 2,
      isOwner: 'Tralalero Tralala',
      legalName: "EcoMarket S.R.L.",
      taxId: "27-98765432-1",
      email: "ventas@ecomarket.pe",
      companySector: "Comercio Sustentable"
    }
  ];


  return (
    <section className="flex flex-col min-h-screen">
      <Header avatar='Juan Ramirez' />
      <section className='flex flex-1'>
        <aside className='flex flex-col gap-1 flex-1 py-5 px-3 border-r-2 border-gray-200'>
          <div className='group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]'>
            <FaUser className='h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]' />
            Perfil
          </div>
          <div className="group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]">
            <FaBuilding className="h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]" />
            Pymes
          </div>
        </aside>
      <div className="flex-[6] min-w-0 p-7 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Pymes</h2>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-max border-collapse w-full">
              <thead className="text-gray-400 text-left">
                <tr className="border-b-2 border-gray-200">
                  <th className="p-3 min-w-40">Nombre Legal</th>
                  <th className="p-3 min-w-40">CUIT</th>
                  <th className="p-3 min-w-40">Email</th>
                  <th className="p-3 min-w-40">Sector</th>
                  <th className="p-3 min-w-40">Dueño</th>
                  <th className="p-3 text-center !w-[150px]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pymesOfTheUser.map((pyme) => (
                  <tr
                    key={pyme.id}
                    className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200"
                  >
                    <td className="p-3">{pyme.legalName}</td>
                    <td className="p-3">{pyme.taxId}</td>
                    <td className="p-3">{pyme.email}</td>
                    <td className="p-3">{pyme.companySector}</td>
                    <td className="p-3">
                      {pyme.isOwner}
                    </td>
                    <td className="p-3 flex justify-end gap-3">
                      <button className="bg-[#0095d5] text-white outline-1 px-4 py-1 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer">
                        Mas Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
      <Footer />
    </section>
  )
}
