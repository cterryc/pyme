import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUpdateUserProfle, useUserProfile } from '@/hooks/useUser'
import { userProfileSchema, type UserProfileFormData } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfileSkeleton } from './Loaders/UserProfileSkeleton'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGetPymesByUser } from '@/hooks/usePyme'
import { useDisconnectSSE } from '@/hooks/useSSENotifications'
import { WelcomeModal } from './Modals/WelcomeModal'

type EditMode = 'none' | 'profile' | 'email' | 'password'

export const UserProfile = () => {
  const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaotZTcu1CLMGOJMDl-f_LYBECs7tqwhgpXA&s'

  // State
  const [editMode, setEditMode] = useState<EditMode>('none')
  const [originalProfile, setOriginalProfile] = useState<UserProfileFormData | null>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Hooks
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const disconnectSSE = useDisconnectSSE()
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

  const { data: pymesData } = useGetPymesByUser()
  const pymes = pymesData?.payload || []

  const { mutate: updateProfile, isPending } = useUpdateUserProfle({
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente', {
        style: { borderColor: '#10b981', backgroundColor: '#f0fdf4', borderWidth: '1px' },
        description: 'Tus datos han sido actualizados exitosamente.',
        duration: 3000
      })
      setEditMode('none')
      refetch()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar tu perfil. Intenta nuevamente.'
      toast.error('Error al actualizar perfil', {
        style: { borderColor: '#ef4444', backgroundColor: '#fef2f2', borderWidth: '1px' },
        description: message,
        duration: 4000
      })
    }
  })

  // Effects
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
      
      // Check if user has no name - show welcome moda
      const hasNoName = !userProfile.payload.firstName?.trim() || !userProfile.payload.lastName?.trim()
      if (hasNoName) {
        setShowWelcomeModal(true)
      }
    }
  }, [userProfile, reset])

  // Methods
  const onSubmit = (data: UserProfileFormData) => {
    if (!userProfile) return

    let dataToSend: Partial<UserProfileFormData> = {}

    if (editMode === 'email') {
      dataToSend = {
        email: data.email,
        currentPassword: data.currentPassword
      }
    } else if (editMode === 'password') {
      dataToSend = {
        newPassword: data.newPassword,
        currentPassword: data.currentPassword
      }
    } else {
      dataToSend = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      }
    }

    updateProfile({ ...dataToSend, profileImage: imageDefault })
  }

  const handleCancelEdit = () => {
    setEditMode('none')
    if (originalProfile) reset(originalProfile)
  }

  const handleLogout = () => {
    toast.info('Cerrando sesión...', {
      style: { borderColor: '#3b82f6', backgroundColor: '#eff6ff', borderWidth: '1px' },
      description: 'Hasta pronto.',
      duration: 2000
    })
    
    // Desconectar SSE antes de cerrar sesión
    disconnectSSE()
    
    localStorage.removeItem('tokenPyme')
    queryClient.clear()
    setTimeout(() => {
      navigate('/inicio-sesion')
    }, 500)
  }

  const handleEditMode = (mode: EditMode) => {
    setEditMode(mode)
    if (mode === 'email' && originalProfile) {
      reset({
        email: originalProfile.email,
        currentPassword: ''
      })
    } else if (mode === 'password') {
      reset({
        currentPassword: '',
        newPassword: ''
      })
    }
  }

  const handleWelcomeSubmit = (data: { firstName: string; lastName: string; phone: string }) => {
    updateProfile({ 
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      profileImage: imageDefault 
    })
    setShowWelcomeModal(false)
  }

  return (
    <>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onSubmit={handleWelcomeSubmit}
        isPending={isPending}
      />

      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>Mi Perfil</h2>
          <p className='mt-1 text-sm text-gray-500'>Gestiona tu información personal</p>
        </div>

      {isLoading && <UserProfileSkeleton />}
      {isError && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600 text-sm'>Error: {error.message}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className='space-y-6'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 sm:px-8'>
              <div className='flex flex-col sm:flex-row items-center gap-6'>
                <div className='relative'>
                  <img
                    src={userProfile?.payload?.profileImage || imageDefault}
                    alt='Profile'
                    className='w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-lg'
                  />
                  <div className='absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white'></div>
                </div>
                <div className='text-center sm:text-left'>
                  <h3 className='text-xl sm:text-2xl font-semibold text-gray-900'>
                    {userProfile?.payload?.firstName} {userProfile?.payload?.lastName}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>{userProfile?.payload?.email}</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className='p-6 sm:p-8'>
              {editMode === 'none' && (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                        Nombre
                      </label>
                      <p className='text-base text-gray-900 font-medium'>
                        {userProfile?.payload?.firstName || '—'}
                      </p>
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                        Apellido
                      </label>
                      <p className='text-base text-gray-900 font-medium'>
                        {userProfile?.payload?.lastName || '—'}
                      </p>
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                        Teléfono
                      </label>
                      <p className='text-base text-gray-900 font-medium'>
                        {userProfile?.payload?.phone || '—'}
                      </p>
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                        Correo Electrónico
                      </label>
                      <p className='text-base text-gray-900 font-medium break-all'>
                        {userProfile?.payload?.email || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {editMode === 'profile' && (
                <div className='space-y-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div>
                      <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                        Nombre
                      </label>
                      <input
                        id='firstName'
                        type='text'
                        {...register('firstName')}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                        placeholder='Tu nombre'
                      />
                      {errors.firstName && (
                        <p className='mt-1.5 text-xs text-red-600'>{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                        Apellido
                      </label>
                      <input
                        id='lastName'
                        type='text'
                        {...register('lastName')}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                        placeholder='Tu apellido'
                      />
                      {errors.lastName && (
                        <p className='mt-1.5 text-xs text-red-600'>{errors.lastName.message}</p>
                      )}
                    </div>
                    <div className='sm:col-span-2'>
                      <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                        Teléfono
                      </label>
                      <input
                        id='phone'
                        type='text'
                        {...register('phone')}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                        placeholder='+51 999 999 999'
                      />
                      {errors.phone && (
                        <p className='mt-1.5 text-xs text-red-600'>{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {editMode === 'email' && (
                <div className='space-y-5'>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                      Nuevo Correo Electrónico
                    </label>
                    <input
                      id='email'
                      type='email'
                      {...register('email')}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                      placeholder='nuevo@email.com'
                    />
                    {errors.email && (
                      <p className='mt-1.5 text-xs text-red-600'>{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='currentPasswordEmail' className='block text-sm font-medium text-gray-700 mb-2'>
                      Contraseña Actual
                    </label>
                    <input
                      id='currentPasswordEmail'
                      type='password'
                      {...register('currentPassword')}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                      placeholder='Tu contraseña actual'
                    />
                    {errors.currentPassword && (
                      <p className='mt-1.5 text-xs text-red-600'>{errors.currentPassword.message}</p>
                    )}
                  </div>
                </div>
              )}

              {editMode === 'password' && (
                <div className='space-y-5'>
                  <div>
                    <label htmlFor='currentPasswordChange' className='block text-sm font-medium text-gray-700 mb-2'>
                      Contraseña Actual
                    </label>
                    <input
                      id='currentPasswordChange'
                      type='password'
                      {...register('currentPassword')}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                      placeholder='Tu contraseña actual'
                    />
                    {errors.currentPassword && (
                      <p className='mt-1.5 text-xs text-red-600'>{errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                      Nueva Contraseña
                    </label>
                    <input
                      id='newPassword'
                      type='password'
                      {...register('newPassword')}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400'
                      placeholder='Mínimo 8 caracteres'
                    />
                    {errors.newPassword && (
                      <p className='mt-1.5 text-xs text-red-600'>{errors.newPassword.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                {editMode === 'none' ? (
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <button
                      type='button'
                      onClick={() => handleEditMode('profile')}
                      className='w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Editar Perfil
                    </button>
                    <button
                      type='button'
                      onClick={() => handleEditMode('email')}
                      className='w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      Cambiar Email
                    </button>
                    <button
                      type='button'
                      onClick={() => handleEditMode('password')}
                      className='w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                      type='button'
                      onClick={handleCancelEdit}
                      disabled={isPending}
                      className='flex-1 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancelar
                    </button>
                    <button
                      type='submit'
                      disabled={isPending}
                      className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isPending ? (
                        <span className='flex items-center justify-center gap-2'>
                          <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                          </svg>
                          Guardando...
                        </span>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>


          {/* PyMEs Section */}
          {editMode === 'none' && (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900'>Mis PyMEs</h3>
                <p className='text-sm text-gray-500 mt-1'>PyMEs registradas a tu nombre</p>
              </div>

              {pymes && pymes.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-200'>
                        <th className='text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Nombre Legal
                        </th>
                        <th className='text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Sector
                        </th>
                        <th className='text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell'>
                          Estado Crédito
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {pymes.map((pyme, index) => (
                        <tr key={pyme.id || index} className='hover:bg-gray-50 transition-colors'>
                          <td className='py-3 px-4 text-sm text-gray-900 font-medium'>
                            {pyme.legalName || '—'}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {pyme.industryName || '—'}
                          </td>
                          <td className='py-3 px-4 text-sm hidden md:table-cell'>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              pyme.statusCredit === 'Aprobado'
                                ? 'bg-green-100 text-green-800'
                                : pyme.statusCredit === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : pyme.statusCredit === 'Rechazado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {pyme.statusCredit || 'Sin estado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                    <svg className='w-8 h-8 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                    </svg>
                  </div>
                  <p className='text-gray-500 text-sm'>No tienes PyMEs registradas</p>
                </div>
              )}
            </div>
          )}

          {/* Email Notifications Section */}
          {editMode === 'none' && (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Notificaciones por Correo</h3>
                  <p className='text-sm text-gray-500 mt-1'>Gestiona las notificaciones que recibes por email</p>
                </div>
                <button
                  type='button'
                  className='px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 whitespace-nowrap'
                >
                  Desactivar Correos
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Section */}
          {/* {editMode === 'none' && (
            <div className='bg-white rounded-xl shadow-sm border border-red-200 p-6 sm:p-8'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='text-lg font-semibold text-red-600'>Zona Peligrosa</h3>
                  <p className='text-sm text-gray-500 mt-1'>Acciones irreversibles</p>
                </div>

                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-red-700 mb-2'>Eliminar Cuenta</h4>
                  <p className='text-sm text-red-600 mb-4'>
                    ⚠️ <strong>Advertencia:</strong> Esta acción es permanente e irreversible. Al eliminar tu cuenta:
                  </p>
                  <ul className='text-sm text-red-600 space-y-1 mb-4 ml-4 list-disc'>
                    <li>Se eliminarán todos tus datos personales</li>
                    <li>Perderás acceso a todas tus PyMEs registradas</li>
                    <li>Se cancelarán todas las solicitudes de crédito pendientes</li>
                    <li>No podrás recuperar tu información posteriormente</li>
                  </ul>
                  <button
                    type='button'
                    className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    Eliminar mi Cuenta
                  </button>
                </div>
              </div>
            </div>
          )} */}

          {/* Logout Section */}
          {editMode === 'none' && (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Cerrar Sesión</h3>
                  <p className='text-sm text-gray-500 mt-1'>Finaliza tu sesión actual de forma segura</p>
                </div>
                <button
                  type='button'
                  onClick={handleLogout}
                  className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 whitespace-nowrap'
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  )
}
