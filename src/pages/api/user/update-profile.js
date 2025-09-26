// src/pages/api/user/update-profile.js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { Formidable } from 'formidable';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export const config = { api: { bodyParser: false } };

const readFile = (req) => {
  const options = {
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    filename: (name, ext, path, form) => Date.now().toString() + "_" + name + ext,
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
    await fs.mkdir(path.join(process.cwd(), "/public/uploads"), { recursive: true });
    const { files } = await readFile(req);
    const uploadedFile = files.image?.[0];
    if (!uploadedFile) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }
    const relativePath = path.join('/uploads', uploadedFile.newFilename);

    // Use the user's email from the validated token to find and update the user
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { image: relativePath },
    });
    
    // Send back the updated user object so the client can refresh its session
    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}