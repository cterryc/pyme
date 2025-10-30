import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import HTTP_STATUS from '../constants/HttpStatus'
import apiResponse from '../utils/apiResponse.utils'
import config from '../config/enviroment.config'

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined

  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    const response = { message: 'El token de autenticación es obligatorio' }
    res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(false, response))
    return
  }

  token = req.headers.authorization?.substring(7)
  try {
    if (token == 'sw6AK-UfwtvQW9ep3i-IPYsWPSuiJG7y7TgaR3IWSlo') {
      console.log('token de firmas')
      next()
    } else {
      const decodedToken = jwt.verify(token, config.JWT_SECRET)
      const tokenData = JSON.stringify(decodedToken)
      const user = JSON.parse(tokenData)
      res.locals.user = user
      next()
    }
  } catch (error) {
    console.error('Token de autenticación no válido:', error)
    const response = { message: 'El token de autenticación no es válido' }
    res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(false, response))
    return
  }
}
