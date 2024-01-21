import nodemailer, { Transporter } from "nodemailer";
import { IEmailSendService } from "./interface.js";

export class GmailSendService implements IEmailSendService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  send(email: string, message: { subject: string; text: string }) {
    const mailOptions = {
      from: "Verification Application <" + process.env.GMAIL_USER + ">",
      to: email,
      ...message,
    };

    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(info);
    });
  }
}
