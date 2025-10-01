// src/pages/api/email.ts
import type { NextApiRequest, NextApiResponse } from 'next/types';
import nodemailer from 'nodemailer';

const DASHBOARD_URL = 'https://brainiacmedia.ai/dashboard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const transporter = nodemailer.createTransport({
    host: 'mail.brainiacmedia.ai',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const to   = req.body.to as string;
  const lang = (req.body.lang as string) || 'en';   // 'es' | 'en'
  const plan = (req.body.plan as string) || 'Premium';
  const name = (req.body.name as string) || '';
  const type = (req.body.type as string) || 'welcome'; // welcome | cancellation | payment_failed

  // ---- subject ----
  let Subject = '';
  if (type === 'cancellation') {
    Subject = lang === 'es'
      ? 'Tu suscripción a Brainiac Media ha sido cancelada'
      : 'Your Brainiac Media subscription has been cancelled';
  } else if (type === 'payment_failed') {
    Subject = lang === 'es'
      ? 'Fallo en el pago de tu suscripción a Brainiac Media'
      : 'Your Brainiac Media payment has failed';
  } else {
    Subject = lang === 'es'
      ? '¡Bienvenido a Brainiac Media!'
      : 'Welcome to Brainiac Media!';
  }

  const Greeting = lang === 'es'
    ? `Hola${name ? ` ${name}` : ''},`
    : `Hi${name ? ` ${name}` : ''},`;

  // ---- lead ----
  let Lead = '';
  if (type === 'cancellation') {
    Lead = lang === 'es'
      ? `Tu suscripción al plan <strong>${plan}</strong> ha sido cancelada. Ya no tendrás acceso a las herramientas premium.`
      : `Your subscription to the <strong>${plan}</strong> plan has been cancelled. You will no longer have access to premium tools.`;
  } else if (type === 'payment_failed') {
    Lead = lang === 'es'
      ? `El pago de tu suscripción al plan <strong>${plan}</strong> ha fallado. Por favor, actualiza tu método de pago para continuar disfrutando de nuestros servicios.`
      : `The payment for your <strong>${plan}</strong> subscription has failed. Please update your payment method to continue using our services.`;
  } else {
    Lead = lang === 'es'
      ? `Gracias por suscribirte al plan <strong>${plan}</strong>. Tu cuenta ya está activa.`
      : `Thanks for subscribing to the <strong>${plan}</strong> plan. Your account is now active.`;
  }

  const CtaDashText = lang === 'es' ? 'Ir al Panel' : 'Go to Dashboard';

  const NoteManage =
    lang === 'es'
      ? `Puedes gestionar tu suscripción desde el área 'Cuenta'.`
      : `You can manage your subscription from the 'Account' area.`;

  const Support = lang === 'es'
    ? `Saludos cordiales,<br><br>el equipo de Brainiac Media.`
    : `Kind regards,<br><br>the Brainiac Media team.`;

  // ---- text fallback ----
  let TextFallback = '';
  if (type === 'cancellation') {
    TextFallback = lang === 'es'
      ? `Suscripción cancelada (${plan}).`
      : `Subscription cancelled (${plan}).`;
  } else if (type === 'payment_failed') {
    TextFallback = lang === 'es'
      ? `Fallo en el pago de la suscripción (${plan}).`
      : `Payment failed for subscription (${plan}).`;
  } else {
    TextFallback = lang === 'es'
      ? `Bienvenido a Brainiac Media (${plan}). Panel: ${DASHBOARD_URL}`
      : `Welcome to Brainiac Media (${plan}). Dashboard: ${DASHBOARD_URL}`;
  }

  const Button = (href: string, label: string) => `
    <a href="${href}" style="
      display:inline-block;padding:12px 18px;border-radius:8px;
      text-decoration:none;font-weight:600;font-family:Arial, sans-serif;
      background:#3b82f6;color:#ffffff;
    ">${label}</a>`;

  const html = `
    <img
      src="https://firebasestorage.googleapis.com/v0/b/nfpts-3d1cb.appspot.com/o/public%2Fbrainiaclogo200.png?alt=media&token=be983452-04cf-45ef-acbb-ff03f577a894"
      alt="Brainiac Media Logo"
      style="display:block;margin:0;width:200px;"
    >
    <div style="background:#f7f7f7;padding:20px;">
      <div style="background:#ffffff;padding:20px;border-radius:8px;
                  font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#444;">
        <p style="margin:0 0 12px 0;">${Greeting}</p>
        <p style="margin:0 0 16px 0;">${Lead}</p>
        ${(type !== 'cancellation') ? `
        <div style="margin:18px 0;">
          ${Button(DASHBOARD_URL, CtaDashText)}
        </div>` : ''}
        <p style="margin:16px 0 8px 0;">${NoteManage}</p>
        <p style="margin:0;">${Support}</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Brainiac Media" <noreply@brainiacmedia.ai>',
      to,
      subject: Subject,
      text: TextFallback,
      html,
    });
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
