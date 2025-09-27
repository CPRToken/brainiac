// src/pages/api/support.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'mail.brainiacmedia.ai',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: 'support@brainiacmedia.ai',
    subject: `BrainiacMedia Support Form Submission from ${name}`, // <-- here
    text: message,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
  });


  return res.status(200).json({ message: 'Message received successfully' });
}
