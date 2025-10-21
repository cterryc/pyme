import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUpdateUserProfle, useUserProfile } from "@/hooks/useUser"
import { userProfileSchema, type UserProfileFormData } from "@/schemas/user.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserProfileSkeleton } from "./Loaders/UserProfileSkeleton"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"


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
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: userProfile, isLoading, isError, error, refetch } = useUserProfile()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema)
  })
  const { mutate: updateProfile, isPending } = useUpdateUserProfle({
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente", {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Tus datos personales han sido actualizados exitosamente.',
        duration: 3000
      })
      setIsEditProfile(false)
      refetch()
    },
    onError: (dataError) => {
      toast.error('Error al actualizar perfil', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: (dataError as any).payload?.message || 'No se pudo actualizar tu perfil. Intenta nuevamente.',
        duration: 4000
      })
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
      reset(initialValues)
    }
  }, [userProfile, reset])


  // methods
  const onSubmit = (data: UserProfileFormData) => {
    if (!userProfile) return null
    if (data.email === userProfile.payload.email) {
      delete data.email;
    }
    updateProfile({ ...data, profileImage: imageDefault });
  }
  const handleCancelEdit = () => {
    setIsEditProfile(false)
    if (originalProfile) reset(originalProfile)
  }
  const deleteToken = () => {
    toast.info('Cerrando sesión...', {
      style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
      description: 'Hasta pronto. Esperamos verte de nuevo.',
      duration: 2000
    })
    localStorage.removeItem('tokenPyme')
    queryClient.clear()
    setTimeout(() => {
      navigate('/Login')
    }, 500)
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Perfil de Usuario</h2>
      {isLoading && <UserProfileSkeleton />}
      {isError && <p className='text-red-400'>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <section className="flex">
          <form className="rounded-2xl w-full">
            <div className="flex p-4 w-full">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={userProfile?.payload?.profileImage || imageDefault}
                  className="rounded-full w-40 h-40"
                />
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2">
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
            <div className="mt-10">
              {!isEditProfile ? (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={deleteToken}
                    className="text-white py-3 text-xl rounded-md bg-[#c24949] hover:bg-[#c95353] transition-colors cursor-pointer w-full flex justify-center items-center gap-4"
                  >
                    Cerrar Sesion
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditProfile(!isEditProfile)}
                    className="text-white py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] transition-colors cursor-pointer w-full flex justify-center items-center gap-4"
                  >
                    Actualizar perfil
                  </button>

                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleCancelEdit()}
                    className="flex-1 py-3 text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] text-white transition-colors"
                  >
                    {isPending ? 'Actualizando. . .' : 'Actualizar'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>
      )}
    </>
  )
}
