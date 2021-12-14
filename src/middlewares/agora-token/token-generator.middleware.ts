import {RtcTokenBuilder, RtmTokenBuilder} from 'agora-access-token'
import { NextFunction, Request, Response } from 'express';
import { TokenType } from '../../interfaces/token.interface';


class TokenGeneratorMiddleware {
  
  tokenSetup(req: Request, res: Response, next: NextFunction){
    const appId = process.env.APP_ID as string
    const appCert = process.env.APP_CERTIFICATE as string
    const tokenType = req.params.tokenType as TokenType
    let token: string
    if(tokenType == TokenType.RTC) {
      token = RtcTokenBuilder.buildTokenWithUid(appId, appCert, req.channelName, req.uid, req.role, req.expireTime)
    } else {
      token = RtmTokenBuilder.buildToken(appId, appCert, req.uid, req.role, req.expireTime)
    }
    req.responseData = {token}
    next()
  }
}

export default new TokenGeneratorMiddleware()