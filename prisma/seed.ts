import { Prisma } from '@prisma/client'
import prisma from '../src/configs/db.config'
import { genSaltSync, hashSync } from 'bcryptjs'

async function main() {
  const password = 'asdqwe123!@#'
  const salt = genSaltSync(10)
  const pwHash = hashSync(password, salt)
  const admin = {
    agoraUid: 0,
    email: 'admin@messenger.com',
    fullName: 'Admin',
    nomorAnggota: '000',
    passwordDigest: pwHash,
    phoneNumber: '0827382469184',
    username: 'admin',
    role: 'ADMIN',
  }
  const user1 = {
    agoraUid: 1,
    email: 'user1@messenger.com',
    fullName: 'User 1',
    nomorAnggota: '001',
    passwordDigest: pwHash,
    phoneNumber: '0827382469185',
    username: 'user1',
    role: 'USER',
  }
  const user2 = {
    agoraUid: 2,
    email: 'user2@messenger.com',
    fullName: 'User 2',
    nomorAnggota: '002',
    passwordDigest: pwHash,
    phoneNumber: '0827382469186',
    username: 'user2',
    role: 'USER',
  }

  const craetedAdmin = await prisma.user.upsert({
    where: {nomorAnggota: '000'},
    create: admin as Prisma.UserCreateInput,
    update: admin as Prisma.UserUpdateInput
  })
  const craetedUser1 = await prisma.user.upsert({
    where: {nomorAnggota: '001'},
    create: user1 as Prisma.UserCreateInput,
    update: user1 as Prisma.UserUpdateInput
  })
  const craetedUser2 = await prisma.user.upsert({
    where: {nomorAnggota: '002'},
    create: user2 as Prisma.UserCreateInput,
    update: user2 as Prisma.UserUpdateInput
  })
  console.info(craetedAdmin)
  console.info(craetedUser1)
  console.info(craetedUser2)
}

main().catch((error) => {
  console.error(error)
}).finally(async () => {
  await prisma.$disconnect()
})