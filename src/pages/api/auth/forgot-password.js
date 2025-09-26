// src/pages/api/auth/forgot-password.js

import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // IMPORTANT: For security, always return a success message, even if the user doesn't exist.
    // This prevents "user enumeration" attacks.
    if (!user) {
      return res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // 1. Generate a secure, short-lived token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 1 hour
    const passwordResetExpires = new Date(Date.now() + 3600000);

    // 2. Save the hashed token and expiry date to the database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // 3. Send the email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: 'onboarding@resend.dev', // You can use this for testing
      to: user.email,
      subject: 'Reset Your Password for Agentic Collective',
      html: `<p>You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error(error);
    // Again, send a generic message to the client
    return res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  }
}