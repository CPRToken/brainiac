//src/pages/api/email.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const transporter = nodemailer.createTransport({
    host: "mail.brainiacmedia.ai",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  if (req.method === 'POST') {
    const email = req.body.to;

    let subjectLine = '';
    let htmlContent = '';

    if (req.body.contentType === 'video') {
      subjectLine = `${req.body.name} Welcome to ${req.body.subject}`;
      htmlContent = `${req.body.name} WElcome to Brainiac Media ${req.body.subject} <br> <a href="${req.body.downloadUrl}">Ver video</a>`;
    } else {
      subjectLine = `${req.body.name} te ha enviado un documento titulado ${req.body.subject}`;
      htmlContent = `${req.body.name} te ha enviado un documento titulado ${req.body.subject} <br> <a href="${req.body.downloadUrl}">Ver documento</a>`;
    }

    const mailOptions = {
      from: '"Brainiac Media" <noreply@brainiacmedia.ai>',
      to: email,
      subject: subjectLine,
      text: req.body.text,
      html: `
      <img src="https://firebasestorage.googleapis.com/v0/b/nfpts-3d1cb.appspot.com/o/public%2Fbrainiaclogo.png?alt=media&token=b110eb36-f6c4-4fec-bd9b-e088f6d2a14a" alt="Virtual Eternity Logo" style="display: block; margin: 0 auto; width: 800px;">
      <div style="background-color: #f7f7f7; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #444444;">
          ${htmlContent}
        </div>
        <img src="https://firebasestorage.googleapis.com/v0/b/nfpts-3d1cb.appspot.com/o/public%2Fbrainiachead.png?alt=media&token=09e7b0a9-390c-48c3-803c-449bba376663" alt="Virtual Eternity Logo" style="display: block; margin: 0 auto; height: 500px;">
      </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
