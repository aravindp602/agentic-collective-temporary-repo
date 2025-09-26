// src/pages/api/user/change-password.js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 1. Authenticate the user
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    // This can happen if the user was deleted but the token is still valid
    if (!user || !user.password) {
      return res.status(404).json({ message: 'User not found or not using password auth.' });
    }

    // 2. Verify the current password is correct
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: 'Incorrect current password.' });
    }

    // 3. Hash the new password and update the user
    const hashedNewPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}