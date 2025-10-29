import { registerPymeSchema, type RegisterPymeFormData } from '@/schemas/pyme.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const PymeForm = ({
  industriesList,
  defaultValues,
  onCancel
}: {
  industriesList: Array<{ id: string; name: string }>
  defaultValues?: RegisterPymeFormData
  onCancel?: () => void
}) => {
  const {
    register: registerPyme,
    // setValue,
    // watch,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterPymeFormData>({
    resolver: zodResolver(registerPymeSchema),
    defaultValues: defaultValues, //getStoredData(),
    mode: 'onChange'
  })

  console.log(defaultValues)
  const onSubmit = (data: RegisterPymeFormData) => {
    console.log(data)
  }

  return (
    <div className='w-full font-medium text-[var(--primary)] bg-white'>
      <form className='flex flex-col text-left px-10 md:px-20 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] py-2 mb-5'>
            Información básica
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Nombre legal</p>

              <input
                type='text'
                {...registerPyme('legalName')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Nombre legal de la empresa'
                style={{ borderColor: errors.legalName ? 'red' : '' }}
              />
              {errors.legalName && <p className='text-red-500 text-center'>{errors.legalName.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Nombre comercial</p>

              <input
                {...registerPyme('tradeName')}
                type='text'
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Nombre comercial de la empresa'
                style={{ borderColor: errors.tradeName ? 'red' : '' }}
              />
              {errors.tradeName && <p className='text-red-500 text-center'>{errors.tradeName.message}</p>}
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm'>CUIT</p>

              <input
                type='text'
                {...registerPyme('taxId')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='XX-XXXXXXXX-X'
                style={{ borderColor: errors.taxId ? 'red' : '' }}
              />
              {errors.taxId && <p className='text-red-500 text-center'>{errors.taxId.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Correo electrónico</p>

              <input
                type='text'
                {...registerPyme('email')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='contacto@empresa.com'
                style={{ borderColor: errors.email ? 'red' : '' }}
              />
              {errors.email && <p className='text-red-500 text-center'>{errors.email.message}</p>}
            </div>
          </div>
        </div>
        <div>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
            Detalles de la empresa
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Industria</p>
              <select
                style={{ borderColor: errors.industryId ? 'red' : '' }}
                className='border p-2 border-[#D1D5DB] rounded-md'
                {...registerPyme('industryId')}
              >
                {industriesList &&
                  industriesList.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
              </select>
              {errors.industryId && <p className='text-red-500 text-center'>{errors.industryId.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Fecha de fundación</p>

              <input
                type='date'
                {...registerPyme('foundedDate', { valueAsDate: true })}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Nombre comercial de la empresa'
                style={{ borderColor: errors.foundedDate ? 'red' : '' }}
                min='2000-01-01'
                max={`${new Date().toISOString().substr(0, 10)}`}
              />
              {errors.foundedDate && <p className='text-red-500 text-center'>{errors.foundedDate.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Cantidad empleados</p>

              <input
                type='number'
                {...registerPyme('employeeCount', { valueAsNumber: true })}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='100'
                style={{ borderColor: errors.employeeCount ? 'red' : '' }}
              />
              {errors.employeeCount && <p className='text-red-500 text-center'>{errors.employeeCount.message}</p>}
            </div>
            <div className='flex flex-col gap-1 '>
              <p className='text-sm'>Ingresos anuales</p>

              <div
                style={{ borderColor: errors.annualRevenue ? 'red' : '' }}
                className='flex items-center border gap-2 border-[#D1D5DB] overflow-hidden rounded-md focus-within:border-black '
              >
                <span className='text-[var(--font-title-light)] bg-[#D1D5DB] p-2'>$</span>
                <input
                  type='number'
                  {...registerPyme('annualRevenue', { valueAsNumber: true })}
                  className='w-full outline-none py-2'
                  placeholder='1000000'
                  min={0}
                />
                <span className='text-[#414141FF] bg-[#D1D5DB] p-2'>USD</span>
              </div>

              {errors.annualRevenue && <p className='text-red-500 text-center'>{errors.annualRevenue.message}</p>}
            </div>
          </div>
        </div>
        <div>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
            Dirección
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Dirección</p>

              <input
                {...registerPyme('address')}
                type='text'
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Av.Corrientes 1234'
                style={{ borderColor: errors.address ? 'red' : '' }}
              />
              {errors.address && <p className='text-red-500 text-center'>{errors.address.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Ciudad</p>

              <input
                type='text'
                {...registerPyme('city')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Ciudad Autónoma de Buenos Aires'
                style={{ borderColor: errors.city ? 'red' : '' }}
              />
              {errors.city && <p className='text-red-500 text-center'>{errors.city.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Estado/Provincia</p>

              <input
                type='text'
                {...registerPyme('state')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Caba'
                style={{ borderColor: errors.state ? 'red' : '' }}
              />
              {errors.state && <p className='text-red-500 text-center'>{errors.state.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Código postal</p>

              <input
                type='text'
                {...registerPyme('postalCode')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='C1043AAS'
                style={{ borderColor: errors.postalCode ? 'red' : '' }}
              />
              {errors.postalCode && <p className='text-red-500 text-center'>{errors.postalCode.message}</p>}
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>País</p>

              <input
                type='text'
                {...registerPyme('country')}
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='Argentina'
                style={{ borderColor: errors.country ? 'red' : '' }}
              />
              {errors.country && <p className='text-red-500 text-center'>{errors.country.message}</p>}
            </div>
          </div>
        </div>
        <div>
          <h3 className='border-b-1 border-[#D1D5DB] text-xl font-medium text-[var(--font-title-light)] mt-15 py-2 mb-5'>
            Contacto y descripción
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Teléfono empresarial</p>
              <div className='border border-[#D1D5DB] rounded-md flex'>
                <select className='h-full px-2 text-xl' {...registerPyme('countryCode')}>
                  <option value='0'>🇺🇾</option>
                  <option value='1'>🇦🇷</option>
                  <option value='2'>🇵🇪</option>
                  <option value='3'>🇵🇾</option>
                </select>
                <input type='text' className='p-2 flex-1' {...registerPyme('phone')} />
              </div>
              {errors.phone && <p className='text-red-500 text-center'>{errors.phone.message}</p>}
              {errors.countryCode && <p className='text-red-500 text-center'>{errors.countryCode.message}</p>}
            </div>
            <div className='flex flex-col gap-1 col-span-2'>
              <p className='text-sm'>Website (opcional)</p>
              <input
                type='text'
                {
                  ...registerPyme('website', { required: false }) /*, { required: false }*/
                }
                className='border p-2 border-[#D1D5DB] rounded-md'
                placeholder='https://www.empresa.com'
                style={{ borderColor: errors.website ? 'red' : '' }}
              />
              {errors.website && <p className='text-red-500 text-center'>{errors.website.message}</p>}
            </div>
            <div className='flex flex-col gap-1 col-span-2'>
              <p className='text-sm'>Descripción</p>
              <textarea
                rows={5}
                {...registerPyme('description')}
                className='border min-h-30 max-h-60 p-2 border-[#D1D5DB] rounded-md'
                placeholder='Describe brevemente tu empresa...'
                style={{ borderColor: errors.description ? 'red' : '' }}
              />
              {errors.description && <p className='text-red-500 text-center'>{errors.description.message}</p>}
            </div>
          </div>
        </div>
        <div className='flex text-center justify-between px-10 md:px-20 mt-20'>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault()
              if (onCancel) onCancel()
            }}
            className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
          >
            Salir
          </button>
          <input
            type='submit'
            className='bg-[var(--primary)] w-[120px] py-1 text-white rounded border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] duration-150 cursor-pointer'
            value='Confirmar'
          />
        </div>
      </form>
    </div>
  )
}
