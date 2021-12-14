import express, { response, Router } from "express"
import authenticationMiddleware from "../middlewares/authentications/authentication.middleware"
import responseMiddleware from "../middlewares/responses/response.middleware"

class AuthRoute {
  private route: Router
  constructor(){
    this.route = express.Router()
  }

  initV1(){
    this.route.post(
      '/login',
      authenticationMiddleware.login,
      responseMiddleware.successResponse
    )
    this.route.get(
      '/me',
      authenticationMiddleware.authenticate,
      responseMiddleware.successResponse
    )
    this.route.get(
      '/new-user/:nomorAnggota',
      authenticationMiddleware.singleUserByNoAnggota,
      responseMiddleware.successResponse
    )
    this.route.put(
      '/create-password/:nomorAnggota',
      authenticationMiddleware.createPasswordAndLogedOn,
      responseMiddleware.successPostPut
    )
    return this.route
  }
}

export default new AuthRoute()