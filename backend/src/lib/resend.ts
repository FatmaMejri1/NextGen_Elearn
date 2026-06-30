import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Helper to send email alerts (e.g. device lock alert)
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined. Skipping email send.');
    return { success: false, message: 'Missing RESEND_API_KEY' };
  }

  try {
    const data = await resend.emails.send({
      from: 'NextGen Academy <security@nextgen-academy.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return { success: false, error };
  }
}