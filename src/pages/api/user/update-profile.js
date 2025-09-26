// src/pages/api/user/update-profile.js

import { put } from '@vercel/blob';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { Formidable } from 'formidable';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export const config = {
  api: {
    bodyParser: false, // Formidable will handle the body parsing
  },
};

// Helper to parse the incoming form data
const readFile = (req) => {
  return new Promise((resolve, reject) => {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files });
    });
  });
};

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { files } = await readFile(req);
    const imageFile = files.image?.[0]; // The key 'image' must match FormData

    if (!imageFile) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Read the file from its temporary path on the Vercel server
    const fileData = await fs.readFile(imageFile.filepath);

    // Upload the file's data (buffer) to Vercel Blob
    const blob = await put(imageFile.originalFilename || 'profile-picture.jpg', fileData, {
      access: 'public',
    });
    
    // Delete the temporary file from the server
    await fs.unlink(imageFile.filepath);

    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { image: blob.url },
    });
    
    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}