//pages/api/cancelled-email.ts
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
    const email = 'admin@brainiacmedia.ai';  // Your email address

    const mailOptions = {
      from: '"Brainiac Media" <noreply@brainiacmedia.ai>',
      to: email,  // Send to your email
      subject: `Subscription Cancelled - ${req.body.customerEmail}`,
      text: `The subscription for ${req.body.customerEmail} has been cancelled. Plan: ${req.body.plan}`,
      html: `<h1>Subscription Cancellation Alert</h1>
             <p>The subscription for <strong>${req.body.customerEmail}</strong> has been cancelled.</p>
             <p>Plan: ${req.body.plan}</p>`
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
