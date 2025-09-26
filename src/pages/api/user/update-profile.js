// src/pages/api/user/update-profile.js

import { put } from '@vercel/blob';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

// It's important to disable the default body parser for Vercel Blob
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // The filename is sent via a special header from the client
  const filename = req.headers['x-vercel-blob-filename'] || 'profile-picture.png';

  try {
    // The request body is the raw file data. We upload it to Vercel Blob.
    const blob = await put(filename, req.body, {
      access: 'public', // Make the file publicly accessible
    });

    // The 'blob' object contains the public URL of the uploaded file
    // We save this URL to the user's record in the database
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { image: blob.url },
    });
    
    // Send back the updated user object with the new image URL
    res.status(200).json({ message: 'Profile updated', user: updatedUser });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}