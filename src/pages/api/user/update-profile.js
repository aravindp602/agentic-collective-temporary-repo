// src/pages/api/user/update-profile.js

import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { Formidable } from 'formidable';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req) => {
  const options = {
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    filename: (name, ext, path, form) => {
      return Date.now().toString() + "_" + name + ext;
    },
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  };
  
  const form = new Formidable(options);
  
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await fs.mkdir(path.join(process.cwd(), "/public/uploads"), { recursive: true });
    
    const { files } = await readFile(req);
    const uploadedFile = files.image?.[0];

    if (!uploadedFile) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }
    
    const relativePath = path.join('/uploads', uploadedFile.newFilename);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: relativePath,
      },
    });

    // CRITICAL: Return the updated user object with the new image path
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  }
}