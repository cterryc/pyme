
export const Auth = () => {
  return (
    <section className="max-w-7xl mx-auto py-10 bg-white min-h-screen flex items-center justify-center">
      <section className="w-full">
        <div className="flex flex-col items-center">
          <h3 className="text-3xl font-bold text-black">Crea tu cuenta</h3>
          <p className="text-[#7d7d7e] text-sm">
            Ya tienes un cuenta?
            <span className="text-[#0095d5] pl-2">Inicia sesión</span>
          </p>
        </div>
        <div className="mt-5">
          <form className="max-w-md mx-auto flex flex-col gap-0">
            <div className="rounded-t-md border-b-0 border-2 border-gray-300">
              <input
                type="text"
                className="border border-gray-300 p-3 outline-none w-full placeholder:text-[#7d7d7e] text-gray-600 border-none"
                placeholder="Correo electrónico"
              />
              {/* <p className="text-red-400 text-xs pl-2 pb-2">Correo electrónico incorrecto</p> */}
            </div>
            <div className="border-b-0 border-2 border-gray-300">
              <input
                type="text"
                className="border border-gray-300 p-3 outline-none w-full placeholder:text-[#7d7d7e] text-gray-600 border-none"
                placeholder="Contraseña"
              />
              {/* <p className="text-red-400 text-xs pl-2 pb-2">Contraseña incorrecta</p> */}
            </div>
            <div className="rounded-b-md border-2 border-gray-300">
              <input
                type="text"
                className="border border-gray-300 p-3 outline-none w-full placeholder:text-[#7d7d7e] text-gray-600 border-none"
                placeholder="Confirma contraseña"
              />
              {/* <p className="text-red-400 text-xs pl-2 pb-2">Confirmacion de contraseña incorrecta</p> */}
            </div>
            <p className="text-[#0095d5] text-right mt-4">Olvidaste tu contraseña?</p>
            <button className="bg-[#0095d5] text-white p-3 rounded-md mt-6 hover:bg-[#28a9d6] transition-colors cursor-pointer">
              Registrarse
            </button>
          </form>
        </div>
      </section>
    </section>
  )
}
