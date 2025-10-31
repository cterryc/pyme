import 'reflect-metadata'
import ExpressAppCreator from './config/createApp'
import MiddlewaresConfig from './config/middlewares.config'
import apiRouter from './routers'
import { NextFunction, Request, Response } from 'express'
import HttpError from './utils/HttpError.utils'
import apiResponse from './utils/apiResponse.utils'
import { handleSSEPreflight, subscribeLoanStatus } from './api/sse/controller'
import authenticateSSE from './middlewares/authenticate.sse.middleware'
import { validateEnvironment } from './utils/validateEnv.utils'

;(async () => {
  try {
    // Validar entorno en producción
    if (process.env.NODE_ENV === 'production') {
      validateEnvironment()
    }

    const appCreator = new ExpressAppCreator()
    const app = await appCreator.createExpressApp()

    MiddlewaresConfig.config(app)

    app.options('/api/events', handleSSEPreflight)
    app.get('/api/events', authenticateSSE, subscribeLoanStatus)

    // app.post("/api/loanRequest/firma",(req:any,res:any)=>{
    //   console.log("Lo que llega de api firma es :",req.body)
    //   res.status(200).json({message:"Good soup!"})
    // })

    app.use('/api', apiRouter)

    // Middleware para manejar errores de JSON mal formado
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      // Error de JSON mal formado
      if (err instanceof SyntaxError && 'body' in err && (err as any).type === 'entity.parse.failed') {
        return res.status(400).json(
          apiResponse(false, {
            message: 'JSON mal formado. Por favor verifica la sintaxis del JSON enviado.',
            details: err.message,
            code: 400
          })
        )
      }

      next(err)
    })

    // Middleware para manejar otros errores
    app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
      console.error('Error capturado:', err)

      const status = err.status || 500
      const message = err.message || 'Internal Server Error'

      res.status(status).json(apiResponse(false, { message, code: status }))
    })
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error)
    process.exit(1)
  }
})()
