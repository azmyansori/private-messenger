import { RtcRole, RtmRole } from "agora-access-token";
import { NextFunction, Request, Response } from "express";
import { json } from "stream/consumers";
import { TokenType } from "../../interfaces/token.interface";

class TokenCredMiddleware {
  setupCredential(req: Request, res:Response, next: NextFunction){
    const tokenType = req.params.tokenType as TokenType
    if(tokenType == TokenType.RTC) {
      if(!req.query.channelName || !req.query.uid) return res.status(500).json({error: 'channel & uid is required'})
    } else {
      if(!req.query.uid) return res.status(500).json({error: 'UID Required'})
    }
    req.uid = req.query.uid as unknown as number
    req.channelName = req.query.channelName as string
    req.expireTime = req.query.expiredTime as unknown as number || 3600
    if(!req.query.role) {
      req.role = tokenType == TokenType.RTC ? RtcRole.SUBSCRIBER : RtmRole.Rtm_User
    }
    next()
  }
}

export default new TokenCredMiddleware()