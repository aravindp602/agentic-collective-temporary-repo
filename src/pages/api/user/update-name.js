// src/pages/api/user/update-name.js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  // Manually decode and verify the token from the request cookies
  const token = await getToken({ req, secret });

  if (!token) {
    // If the token is invalid or not present, return unauthorized
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    // Use the user's email from the validated token to find and update the user
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { name: name.trim() },
    });

    res.status(200).json({ message: 'Name updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}