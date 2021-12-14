-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('RTC', 'RTM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "agoraUid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorAnggota" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "passwordDigest" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_pics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldname" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "destination" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "profile_pics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_channels" (
    "id" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelType" "ChannelType" NOT NULL,

    CONSTRAINT "group_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupChannelToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_agoraUid_key" ON "users"("agoraUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nomorAnggota_key" ON "users"("nomorAnggota");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "profile_pics_userId_key" ON "profile_pics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupChannelToUser_AB_unique" ON "_GroupChannelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupChannelToUser_B_index" ON "_GroupChannelToUser"("B");

-- AddForeignKey
ALTER TABLE "profile_pics" ADD CONSTRAINT "profile_pics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupChannelToUser" ADD FOREIGN KEY ("A") REFERENCES "group_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupChannelToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
