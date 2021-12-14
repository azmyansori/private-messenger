import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { transporter } from '../../configs/mailer.config';

class MailerMiddleware {
  createUserMailer(req: Request, res: Response, next: NextFunction) {
    const userEmail = (req.responseData as User).email;
    const nomorAnggota = (req.responseData as User).nomorAnggota;
    const deeplink = `http://messenger.kartala.id/new-user/${nomorAnggota}`
    const emailText = `deep link = ${deeplink}`;
    const emailHtml = `
      <p>Deeplink</p>
      </br>
      <p><a href="${deeplink}">deeplink</a></p>`;
    transporter.sendMail({
      from: `noreply@${req.hostname}`,
      to: userEmail,
      subject: `Selamat Datang di Aplikasi`,
      text: emailText,
      html: emailHtml,
    });
    // console.log("Message sent: %s", info.messageId);
    next();
  }
}

export default new MailerMiddleware();