/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Request} from 'express'
import { User } from '@prisma/client';
declare global {
  namespace Express {
    interface Request {
      uid: number
      channelName: string
      role: number
      expireTime: number
      rtcToken: string
      responseData: Record<string, unknown> | Record<string, unknown>[]
      logedOnUser: User
    }
  }
}