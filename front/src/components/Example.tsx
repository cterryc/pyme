import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


// EXAMPLE GET
export const ExampleGet = () => {

  // using the useUser hook
  const { data: user, isLoading, isError, error } = useUser();
  return (
    <div>
      <h1>User Info</h1>
      {isLoading && <p>Cargando...</p>}
      {isError && <p>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <div>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      )}
    </div>
  )
}


//  EXAMPLE POST - PUT - DELETE
export const ExamplePost = () => {

  // using react-hook-form with zod validation
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // using the useAuth hook
  const { mutate, isPending, isError, error } = useAuth({
    onSuccess: (data) => {
      console.log("Registro exitoso:", data)
    }
  })

  // function to handle form submission
  const submitData = (data: RegisterFormData) => {
    mutate(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitData)}>
        <div>
          <input type="email" {...register("email")} placeholder="Email" required />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <input type="text" {...register("username")} placeholder="Username" required />
        <input type="password" {...register("password")} placeholder="Password" required />
        <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" required />
        <button type="submit" disabled={isPending}>
          {isPending ? "Cargando..." : "Registrarse"}
        </button>
      </form>
      {isError && <p>Error en el servidor: {error.message}</p>}
    </>
  )
}
