import { Prisma, User } from "@prisma/client";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from 'agora-rtc-sdk'
import { NextFunction, Request, Response } from "express";
import prisma from "../../configs/db.config";
import { ChannelInput, GroupInput, PhoneBookInput } from "../../interfaces/channel.interface";
import { UnprocessableEntityError } from "../../interfaces/custom-error.class";

class GroupChannelMiddleware {
  async listGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await prisma.groupChannel.findMany({
        where: {
          participants: {
            some: {
              id: req.logedOnUser.id
            }
          }
        },
        include: {
          _count: true,
          participants: {
            where: {
              NOT: [
                {
                  id: req.logedOnUser.id
                }
              ]
            },
            select: {
              id: true,
              agoraUid: true,
              email: true,
              fullName: true,
              nomorAnggota: true,
              phoneNumber: true,
              username: true
            }
          }
        }
      })
      req.responseData = groups
      next()
    } catch (error) {
      next(error)
    }
  }

  async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as PhoneBookInput
      const admin = await prisma.user.findFirst({where: {role: 'ADMIN'}})
      const adminContactExist = await prisma.groupChannel.findMany({
        where: {
          channelType: 'CONTACT',
          participants: {
            every: {
              OR: [
                {
                  nomorAnggota: admin?.nomorAnggota!
                },
                {
                  nomorAnggota: input.owner
                }
              ]
            }
          }
        }
      })
      console.log(adminContactExist)
      if(adminContactExist.length == 0){
        await prisma.groupChannel.create({
          data: {
            channelType: 'CONTACT',
            channelName: `c-${input.owner}-${admin?.nomorAnggota}`,
            participants: {
              connect: [
                {
                  nomorAnggota: input.owner
                },
                {
                  nomorAnggota: admin?.nomorAnggota
                }
              ]
            }
          }
        })
      }
      await Promise.all(input.contacts.map(async(data) => {
        console.log("OWNER", input.owner)
        console.log("CONTACT", data.nomorAnggota)
        const isExist = await prisma.groupChannel.findMany({
          where: {
            channelType: 'CONTACT',
            participants: {
              every: {
                OR: [
                  {
                    nomorAnggota: input.owner
                  },
                  {
                    nomorAnggota: data.nomorAnggota
                  },
                  {
                    nomorAnggota: admin?.nomorAnggota
                  }
                ]
              },
            }
          },
          include: {
            participants: true
          }
        })
        const adminContact = await prisma.groupChannel.findMany({
          where: {
            channelType: 'CONTACT',
            participants: {
              every: {
                OR: [
                  {
                    nomorAnggota: admin?.nomorAnggota
                  },
                  {
                    nomorAnggota: data.nomorAnggota
                  }
                ]
              }
            }
          }
        })
        // const users = await prisma.user.count()
        // console.log("total user :", users - 2)
        console.dir(isExist.length)
        if(3 - isExist.length - (adminContact.length > 0 ? 0 : 1) > 0){
          await prisma.groupChannel.create({
            data: {
              channelType: 'CONTACT',
              channelName: `c-${input.owner}-${data.nomorAnggota}`,
              participants: {
                connect: [
                  {
                    nomorAnggota: data.nomorAnggota
                  },
                  {
                    nomorAnggota: input.owner
                  },
                  {
                    nomorAnggota: admin?.nomorAnggota
                  }
                ]
              }
            }
          })
        }
      }))
      next()
    } catch (error) {
      next(error)
    }
  }

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as GroupInput
      if(!input.channelName) {
        throw new UnprocessableEntityError("field 'channelName is required'")
      }
      const admin = await prisma.user.findFirst({where: {role: 'ADMIN'}})
      const groupParticipants = input.participants.map((data)=> {
        return {
          nomorAnggota: data.nomorAnggota
        }
      })
      if(admin) {
        groupParticipants.push({
          nomorAnggota: admin.nomorAnggota
        })
      }
      await prisma.groupChannel.create({
        data: {
          channelType: 'GROUP',
          channelName: input.channelName,
          participants: {
            connect: groupParticipants
          }
        }
      })
      next()
    } catch (error) {
      next(error)
    }
  }

  async detailGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await prisma.groupChannel.findFirst(
        {
          where: {
            id: req.params.id,
            channelType: 'GROUP'
          },
          include: {
            _count: true,
            participants: {
              where: {
                NOT: {
                  role: 'ADMIN'
                }
              },
              select: {
                id: true,
                email: true,
                nomorAnggota: true,
                fullName: true,
                phoneNumber: true,
                username: true,
              }
            }
          }
        }
      )
      req.responseData = group || {}
      next() 
    } catch (error) {
      next(error)
    }
  }

  // async updateGroup(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const input = req.body as ChannelInput
  //     const participantConnect = [] as Prisma.UserWhereUniqueInput[]
  //     const participantDisconnect = [] as Prisma.UserWhereUniqueInput[]
  //     if (input.participants.length > 0) {
  //       input.participants.forEach((data) => {
  //         if(data._destroy) {
  //           participantDisconnect.push({
  //             id: data.id
  //           })
  //         } else {
  //           participantConnect.push({
  //             id: data.id
  //           })
  //         }
  //       })
  //     }
  //     await prisma.groupChannel.update({
  //       where: {id: req.params.id}, 
  //       data: {
  //         channelName: input.channelName,
  //         participants: {
  //           connect: participantConnect as Prisma.Enumerable<Prisma.UserWhereUniqueInput>,
  //           disconnect: participantDisconnect as Prisma.Enumerable<Prisma.UserWhereUniqueInput>
  //         }
  //       }
  //     })
  //     next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }
  // async deleteGroup(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     await prisma.groupChannel.delete({where: {id: req.params.id}})
  //     next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}


export default new GroupChannelMiddleware()