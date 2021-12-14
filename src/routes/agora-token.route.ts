import express, { Router } from "express";
import tokenCredMiddleware from "../middlewares/agora-token/token-cred.middleware";
import tokenGeneratorMiddleware from "../middlewares/agora-token/token-generator.middleware";
import responseMiddleware from "../middlewares/responses/response.middleware";

class AgoraTokenRoute {
  private route: Router
  constructor(){
    this.route = express.Router()
  }

  initV1(){
    this.route.get(
      '/:tokenType',
      tokenCredMiddleware.setupCredential,
      tokenGeneratorMiddleware.tokenSetup,
      responseMiddleware.successResponse
    )
    return this.route
  }
}

export default new AgoraTokenRoute()