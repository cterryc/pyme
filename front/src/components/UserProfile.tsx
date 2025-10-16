import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useUpdateUserProfle, useUserProfile } from "@/hooks/useUser"
import { userProfileSchema, type UserProfileFormData } from "@/schemas/user.schema"
import { zodResolver } from "@hookform/resolvers/zod"

export const UserProfile = () => {
  const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaotZTcu1CLMGOJMDl-f_LYBECs7tqwhgpXA&s'

  // variables
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false)
  const [originalProfile, setOriginalProfile] = useState<UserProfileFormData | null>(null)

  const fields = [
    { name: 'firstName', label: 'Nombre de Usuario', type: 'text' },
    { name: 'lastName', label: 'Apellido de Usuario', type: 'text' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'phone', label: 'Teléfono', type: 'text' },
  ]
  // hooks
  const { data: userProfile } = useUserProfile()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema)
  })
  const { mutate: updateProfile, isPending } = useUpdateUserProfle({
    onSuccess: (data) => {
      console.log(data)
    }
  })
  useEffect(() => {
    if (userProfile?.payload) {
      const initialValues = {
        firstName: userProfile.payload.firstName || '',
        lastName: userProfile.payload.lastName || '',
        email: userProfile.payload.email || '',
        phone: userProfile.payload.phone || '',
        profileImage: userProfile.payload.profileImage || '',
      }
      setOriginalProfile(initialValues)
      // inicializar inputs de react-hook-form con los datos del getProfile
      reset(initialValues)
    }
  }, [userProfile, reset])


  // methods
  const onSubmit = (data: UserProfileFormData) => {
    // agregar el profileImage harcodeado por ahora
    updateProfile({ ...data, profileImage: imageDefault });
  }
  const handleCancelEdit = () => {
    setIsEditProfile(false)
    // resetar inputs de react-hook-form con los datos del getProflie
    if (originalProfile) reset(originalProfile)
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Perfil de Usuario</h2>
      <section className="flex">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl w-full">
          <div className="flex p-4 w-full">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={userProfile?.payload?.profileImage || imageDefault}
                className="rounded-full w-40 h-40"
              />
            </div>

            <div className="flex-1 flex flex-col justify-start gap-2 h-[350px]">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="block text-lg text-gray-500 font-semibold">
                    {field.label}
                  </label>
                  {isEditProfile ? (
                    <div className='rounded-md border-2 border-gray-300 font-semibold'>
                      <input
                        id={field.name}
                        type={field.type}
                        {...register(field.name as keyof UserProfileFormData)}
                        className='border-none p-2 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
                      />
                      {errors[field.name as keyof typeof errors] && (
                        <span className='text-red-500 text-xs pl-3'>
                          {errors[field.name as keyof typeof errors]?.message as string}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1">
                      {userProfile?.payload?.[field.name as keyof UserProfileFormData] || 'No Data'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mx-4 mb-4">
            {!isEditProfile ? (
              <div className="flex gap-4">
                <button
                  className="text-white py-3 text-xl rounded-md bg-[#c24949] hover:bg-[#c95353] transition-colors cursor-pointer w-full flex justify-center items-center gap-4"
                >
                  Cerrar Sesion
                </button>
                <button
                  onClick={() => setIsEditProfile(true)}
                  className="text-white py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] transition-colors cursor-pointer w-full flex justify-center items-center gap-4"
                >
                  Actualizar perfil
                </button>

              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => handleCancelEdit()}
                  className="flex-1 py-3 text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] text-white transition-colors"
                >
                  {isPending ? 'Actualizando. . .' : 'Actualizar'}
                </button>
              </div>
            )}
          </div>
        </form>
      </section>
    </>
  )
}
