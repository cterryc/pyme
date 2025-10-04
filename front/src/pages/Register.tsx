import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

export const Register = () => {
  const borderColor = '#D4D4D4'
  const borderErrorColor = '#FB2C36'
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const formValues = {
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    }
    console.log(formValues)
    setEmailError('mensaje de error para email')
    setPasswordError('mensaje de error para contraseña')
  }

  return (
    <>
      <Header avatar={''} />
      <article className='min-h-[78vh] max-w-7xl m-auto p-3 content-center text-center'>
        <h3 className='font-bold text-3xl text-[var(--font-title-light)] '>Crea tu cuenta</h3>
        <p className='inline mx-2'>¿Ya tienes cuenta creada?</p>
        <Link to='/' className='text-[var(--primary)] font-medium'>
          Inicia sesión
        </Link>
        <form className='flex flex-col items-center gap-3 my-5' onSubmit={handleSubmit}>
          {emailError != '' && <p className='text-xs text-[#FB2C36]'>{emailError}</p>}
          <input
            type='email'
            placeholder='Correo electrónico'
            name='email'
            className='border p-3 max-w-sm w-full rounded-md'
            style={{ borderColor: !emailError ? borderColor : borderErrorColor }}
          />
          {passwordError != '' && <p className='text-xs text-[#FB2C36]'>{passwordError}</p>}

          <div className='relative max-w-sm w-full rounded-md w-full '>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Contraseña'
              name='password'
              className='w-full p-3 border rounded-md '
              style={{ borderColor: !passwordError ? borderColor : borderErrorColor }}
            />
            {!showPassword && (
              <HiOutlineEyeOff
                onClick={() => {
                  setShowPassword(true)
                }}
                className='absolute top-[1px] right-[1px] h-[calc(100%-2px)] bg-[#D4D4D4] w-[50px] p-3 cursor-pointer rounded-md'
                style={passwordError ? { color: 'white', backgroundColor: borderErrorColor } : {}}
              />
            )}
            {showPassword && (
              <HiOutlineEye
                onClick={() => {
                  setShowPassword(false)
                }}
                className='absolute top-[1px] right-[1px] h-[calc(100%-2px)] bg-[#D4D4D4] w-[50px] p-3 cursor-pointer rounded-md'
                style={passwordError ? { color: 'white', backgroundColor: borderErrorColor } : {}}
              />
            )}
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirmar contraseña'
            name='confirmPassword'
            className='border p-3 max-w-sm w-full rounded-md'
            style={{ borderColor: !passwordError ? borderColor : borderErrorColor }}
          />
          <button className='bg-[var(--primary)] p-2  max-w-sm w-full  text-white rounded-md border border-[var(--primary)] hover:bg-white hover:text-[var(--primary)] cursor-pointer'>
            Registrarse
          </button>
        </form>
      </article>
      <Footer />
    </>
  )
}
