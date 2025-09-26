// src/pages/api/auth/reset-password.js

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }
  
  // 1. Re-hash the incoming token to find it in the database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // 2. Find the user by the hashed token and check if it's expired
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() }, // 'gt' means "greater than"
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
  }

  // 3. Hash the new password
  const hashedPassword = await hash(password, 12);

  // 4. Update user's password and clear the reset token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return res.status(200).json({ message: 'Password has been reset successfully.' });
}