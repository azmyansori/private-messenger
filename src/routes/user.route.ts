import express, { Router } from "express";
import mailerMiddleware from "../middlewares/mailer/mailer.middleware";
import permissionMiddleware from "../middlewares/permissions/permission.middleware";
import responseMiddleware from "../middlewares/responses/response.middleware";
import userMiddleware from "../middlewares/users/user.middleware";

class UserRoute {
  private route: Router
  constructor(){
    this.route = express.Router()
  }

  initV1(){
    this.route.get(
      '/',
      userMiddleware.userList,
      responseMiddleware.successResponse,
    )
    this.route.post(
      '/',
      permissionMiddleware.adminOnly,
      userMiddleware.createUser,
      mailerMiddleware.createUserMailer,
      responseMiddleware.successPostPut
    )
    this.route.get(
      '/:id',
      userMiddleware.singleUser,
      responseMiddleware.successResponse
    )
    this.route.put(
      '/:id',
      permissionMiddleware.adminOnly,
      userMiddleware.updateUser,
      responseMiddleware.successPostPut
    )
    this.route.delete(
      '/:id',
      permissionMiddleware.adminOnly,
      userMiddleware.deleteUser,
      responseMiddleware.successDelete
    )
    return this.route
  }
}

export default new UserRoute()