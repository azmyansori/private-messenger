import nodemailer, { TransportOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporterOptions: SMTPTransport.Options = {
  host: process.env.MAILER_HOST || 'smtp.ethereal.email',
  port: (+process.env.MAILER_PORT! as number) || 587,
  secure: false,
  auth: {
    user: process.env.MAILER_USER || 'cora.runolfsson11@ethereal.email',
    pass: process.env.MAILER_PASSWORD || 'a6afgMyeaGj2VjsM11',
  },
};

export const transporter = nodemailer.createTransport(transporterOptions);
