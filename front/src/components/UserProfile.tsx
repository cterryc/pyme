import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUpdateUserProfle, useUserProfile } from '@/hooks/useUser'
import { userProfileSchema, type UserProfileFormData } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfileSkeleton } from './Loaders/UserProfileSkeleton'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export const UserProfile = () => {
  const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaotZTcu1CLMGOJMDl-f_LYBECs7tqwhgpXA&s'

  // variables
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false)
  const [isEditEmail, setIsEditEmail] = useState<boolean>(false)
  const [isEditPassword, setIsEditPassword] = useState<boolean>(false)
  const [originalProfile, setOriginalProfile] = useState<UserProfileFormData | null>(null)

  const fields = [
    { name: 'firstName', label: 'Nombre de Usuario', type: 'text', updateEmail: false, updatePassword: false },
    { name: 'lastName', label: 'Apellido de Usuario', type: 'text', updateEmail: false, updatePassword: false },
    { name: 'phone', label: 'Teléfono', type: 'text', updateEmail: false, updatePassword: false },
    { name: 'email', label: 'Correo Electrónico', type: 'email', updateEmail: true, updatePassword: false },
    { name: 'currentPassword', label: 'Contraseña Actual', type: 'password', updateEmail: true, updatePassword: true },
    { name: 'newPassword', label: 'Nueva Contraseña', type: 'password', updateEmail: false, updatePassword: true }
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
    resolver: zodResolver(userProfileSchema),
    shouldUnregister: false
  })
  const { mutate: updateProfile, isPending } = useUpdateUserProfle({
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Tus datos personales han sido actualizados exitosamente.',
        duration: 3000
      })
      setIsEditProfile(false)
      setIsEditEmail(false)
      setIsEditPassword(false)
      refetch()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar tu perfil. Intenta nuevamente.'

      toast.error('Error al actualizar perfil', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: message,
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
        profileImage: userProfile.payload.profileImage || ''
      }
      setOriginalProfile(initialValues)
      reset(initialValues)
    }
  }, [userProfile, reset])

  useEffect(() => {
    if (!originalProfile) return
    if (isEditEmail) {
      reset({
        email: originalProfile.email,
        currentPassword: ''
      })
    }
  }, [isEditEmail, reset, originalProfile])

  // methods
  const onSubmit = (data: UserProfileFormData) => {
    let dataToSend: Partial<UserProfileFormData> = { ...data }
    if (!userProfile) return null
    if (isEditEmail) {
      dataToSend = {
        email: data.email,
        currentPassword: data.currentPassword
      }
    }
    if (isEditPassword) {
      dataToSend = {
        newPassword: data.newPassword,
        currentPassword: data.currentPassword
      }
    }
    if (!isEditEmail && !isEditPassword) {
      delete dataToSend.email
    }
    console.log('Data to send:', dataToSend)
    updateProfile({ ...dataToSend, profileImage: imageDefault })
  }

    // const dataToSend = Object.fromEntries(
    //   Object.entries(data).filter(([, v]) => v !== '')
    // ) as Partial<UserProfileFormData>;

    updateProfile({ ...data, profileImage: imageDefault })
  }

  const handleCancelEdit = () => {
    setIsEditProfile(false)
    setIsEditEmail(false)
    setIsEditPassword(false)
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
      <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Perfil de Usuario</h2>
      {isLoading && <UserProfileSkeleton />}
      {isError && <p className='text-red-400'>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <section className='flex'>
          <form className='rounded-2xl w-full'>
            <div className='flex p-4 w-full'>
              <div className='flex-1 flex items-center justify-center'>
                <img src={userProfile?.payload?.profileImage || imageDefault} className='rounded-full w-40 h-40' />
              </div>
              <div className='flex-1 flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-2'>
                  {fields
                    .filter((field) => {
                      if (isEditEmail) return field.updateEmail
                      if (isEditPassword) return field.updatePassword
                      return !field.updateEmail && !field.updatePassword
                    })
                    .map((field, index) => (
                      <div key={index} className='flex flex-col gap-1'>
                        <label htmlFor={field.name} className='block text-lg text-gray-500 font-semibold'>
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
                          <p className='mt-1'>
                            {userProfile?.payload?.[field.name as keyof UserProfileFormData] || 'No Data'}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
                <div className='flex gap-4'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsEditEmail(true)
                      setIsEditPassword(false)
                      setIsEditProfile(true)
                    }}
                    className={`'h-full text-white py-3 font-semibold w-full rounded-md
                      ${
                        isEditEmail
                          ? 'cursor-default select-none bg-gray-300'
                          : 'cursor-pointer bg-[#0095d5] hover:bg-[#28a9d6]'
                      }
                    `}
                  >
                    Actualizar Correo
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setIsEditEmail(false)
                      setIsEditPassword(true)
                      setIsEditProfile(true)
                    }}
                    className={`h-full text-white py-3 font-semibold w-full rounded-md
                      ${
                        isEditPassword
                          ? 'cursor-default select-none bg-gray-300'
                          : 'cursor-pointer bg-[#0095d5] hover:bg-[#28a9d6]'
                      }
                    `}
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </div>
            <div className='mt-10'>
              {isEditProfile ? (
                <div className='flex gap-4'>
                  <button
                    type='button'
                    onClick={() => handleCancelEdit()}
                    className='flex-1 py-3 text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors cursor-pointer'
                  >
                    Cancelar
                  </button>
                  <button
                    type='button'
                    onClick={handleSubmit(onSubmit)}
                    className='flex-1 py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] text-white transition-colors cursor-pointer'
                  >
                    {isPending
                      ? 'Actualizando. . .'
                      : isEditEmail
                      ? 'Actualizar Correo'
                      : isEditPassword
                      ? 'Actualizar Contraseña'
                      : 'Actualizar'}
                  </button>
                </div>
              ) : (
                <div className='flex gap-4'>
                  <button
                    type='button'
                    onClick={deleteToken}
                    className='text-white py-3 text-xl rounded-md bg-[#c24949] hover:bg-[#c95353] transition-colors cursor-pointer w-full flex justify-center items-center gap-4'
                  >
                    Cerrar Sesion
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsEditProfile(true)}
                    className='text-white py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] transition-colors cursor-pointer w-full flex justify-center items-center gap-4'
                  >
                    Actualizar perfil
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
