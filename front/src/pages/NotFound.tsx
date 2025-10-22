export const NotFound = () => {
  return (
    <section>
      <div className='min-h-screen flex flex-col items-center justify-center text-center px-4'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>404 - Página no encontrada</h1>
        <p className='text-gray-600'>Lo sentimos, la ruta que estás buscando no existe.</p>
        <button
          onClick={() => (window.location.href = '/')}
          className='mt-4 px-4 py-2 bg-[#0095d5] text-white rounded hover:bg-[#28a9d6] cursor-pointer'
        >
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
