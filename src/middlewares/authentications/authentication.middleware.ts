import { compare, genSaltSync, hashSync } from "bcryptjs";
import { NextFunction, Request, response, Response } from "express";
import prisma from "../../configs/db.config";
import {JwtPayload, sign, verify} from 'jsonwebtoken'
import { AuthenticationError, AuthorizationError } from "../../interfaces/custom-error.class";
import { Prisma, User } from "@prisma/client";

class AuthenticationMiddleware {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      if(!req.body?.password || !req.body?.nomorAnggota) {
        throw new Error('Invalid Post Request')
      }
      const findUser = await prisma.user.findUnique({
        where: { nomorAnggota: req.body.nomorAnggota }
      });
      if (!findUser) {
        throw new AuthenticationError(
          'Pengguna tidak valid, cek kembali Nomor anggota anda',
        );
      }
      if(!findUser.passwordDigest){
        throw new AuthenticationError(
          'Pengguna tidak belum membuat password'
        )
      }
      const matched_pass = await compare(req.body.password, findUser.passwordDigest);
      if (!matched_pass) {
        throw new AuthenticationError('Kata sandi tidak sesuai');
      }
      const encryptedData = {
        nomorAnggota: findUser.nomorAnggota,
      };
      const jwtToken = sign(encryptedData, process.env.TOKEN_SECRET as string);
      const jwtObject = {
        access_token: jwtToken,
        // expired_in: process.env.TOKEN_EXPIRED,
      };
      req.responseData = jwtObject
      next()
    } catch (error) {
      next(error)
    }
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new AuthorizationError()
      }
      const slicedToken = authHeader.split(' ')[1];
      if (!slicedToken) {
        throw new AuthorizationError()
      }
      const user = verify(slicedToken, process.env.TOKEN_SECRET as string) as JwtPayload;
      const logedOnUser = (await prisma.user.findUnique({
        where: { nomorAnggota: user.nomorAnggota },
        select: {
          id: true,
          agoraUid: true,
          email: true,
          username: true,
          phoneNumber: true,
          fullName:true,
          profilePics: true,
          nomorAnggota: true,
          role: true, 
          twoFactorAuth: true
        }
      }));
      if (!logedOnUser) {
        throw new AuthorizationError();
      }
      req.logedOnUser = logedOnUser as unknown as User
      req.responseData = logedOnUser
      next()
    } catch (error) {
      next(error)
    }
  }

  async singleUserByNoAnggota(req: Request, res: Response, next: NextFunction) {
    try {
      req.responseData = await prisma.user.findUnique({
        where: {nomorAnggota: req.params.nomorAnggota},
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
      }) || {}
      next()
    } catch (error) {
      next(error)
    }
  }

  async createPasswordAndLogedOn(req: Request, res: Response, next: NextFunction){
    try {
      const userId = req.params.nomorAnggota
      const password = req.body.password as string
      const saltKey = genSaltSync(10)
      const digPassword = hashSync(password, saltKey)
      await prisma.user.update({where: {nomorAnggota: userId}, data: {
        passwordDigest: digPassword
      }})
      // const encryptedData = {
      //   nomorAnggota: updatedUser.nomorAnggota,
      // };
      // const jwtToken = sign(encryptedData, process.env.TOKEN_SECRET as string, {
      //   expiresIn: process.env.TOKEN_EXPIRED,
      // });
      // const jwtObject = {
      //   access_token: jwtToken,
      //   expired_in: process.env.TOKEN_EXPIRED,
      // };
      // req.responseData = jwtObject
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthenticationMiddleware()