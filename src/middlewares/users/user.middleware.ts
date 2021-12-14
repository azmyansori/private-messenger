import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../../configs/db.config";
import { AuthorizationError } from "../../interfaces/custom-error.class";

class UserMiddleware {
  async userList(req: Request, res: Response, next: NextFunction) {
    try {
      const logedOn = req.logedOnUser
      const users = await prisma.user.findMany(
        {
          where: {
            nomorAnggota: {
              not: logedOn.nomorAnggota
            }
          },
          select: {
            id: true,
            agoraUid: true,
            email: true,
            fullName: true,
            nomorAnggota: true,
            phoneNumber: true,
            profilePics: true,
            role: true,
            username: true
          }
        }
      )
      req.responseData = users
      next()
    } catch (error) {
      next(error)
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const inputBody = req.body as Prisma.UserCreateInput
      const createdUser = await prisma.user.create({
        data: inputBody
      })
      req.responseData = createdUser
      next()
    } catch (error) {
      next(error)
    }
  }

  

  async singleUser(req: Request, res: Response, next: NextFunction) {
    try {
      req.responseData = await prisma.user.findUnique(
        {
          where: {id: req.params.id},
          select: {
            id: true,
            agoraUid: true,
            email: true,
            fullName: true,
            nomorAnggota: true,
            phoneNumber: true,
            profilePics: true,
            role: true,
            username: true
          }
        }
      ) || {}
      next()
    } catch (error) {
      next(error)
    }
  }

  
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const inputBody = req.body as Prisma.UserUpdateInput
      await prisma.user.update({
        where: {id: req.params.id},
        data: inputBody
      })
      next()
    } catch (error) {
      next(error)
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.user.delete({
        where: {id: req.params.id}
      })
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserMiddleware()