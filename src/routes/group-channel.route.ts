import express, { Router } from "express";
import groupChannelMiddleware from "../middlewares/channels/group-channel.middleware";
import permissionMiddleware from "../middlewares/permissions/permission.middleware";
import responseMiddleware from "../middlewares/responses/response.middleware";

class GroupChannelRoute {
  private route: Router
  constructor(){
    this.route = express.Router()
  }

  initV1(){
    this.route.get(
      '/',
      groupChannelMiddleware.listGroup,
      responseMiddleware.successResponse
    )
    this.route.post(
      '/groups',
      permissionMiddleware.adminOnly,
      groupChannelMiddleware.createGroup,
      responseMiddleware.successPostPut
    )
    this.route.post(
      '/contacts',
      permissionMiddleware.adminOnly,
      groupChannelMiddleware.createContact,
      responseMiddleware.successPostPut
    )
    return this.route
  }
}

export default new GroupChannelRoute()