// src/pages/api/notes/[botId].js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { botId } = req.query;
  const userId = token.id;

  if (req.method === 'GET') {
    try {
      const note = await prisma.note.findUnique({
        where: { userId_botId: { userId, botId } },
      });
      res.status(200).json(note); // Will be null if not found
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch note.' });
    }
  } else if (req.method === 'POST') {
    const { content } = req.body;
    try {
      const note = await prisma.note.upsert({
        where: { userId_botId: { userId, botId } },
        update: { content },
        create: { content, botId, userId },
      });
      res.status(200).json({ message: 'Note saved!', note });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save note.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}