// src/pages/api/user/delete-account.js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  // 1. Authenticate the user
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // 2. Ensure it's a DELETE request
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 3. Delete the user from the database
    // The Prisma schema is set up to cascade deletes, so this will also
    // remove associated Account and Session records.
    await prisma.user.delete({
      where: { email: token.email },
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}