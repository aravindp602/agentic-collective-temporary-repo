// src/pages/api/actions/share-note.js

import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const token = await getToken({ req, secret });
    if (!token) {
        return res.status(401).json({ message: 'You must be logged in to share.' });
    }

    const { content, botId, botName } = req.body;
    if (!content || !botId || !botName) {
        return res.status(400).json({ message: 'Content and bot details are required.' });
    }

    try {
        const newSharedNote = await prisma.sharedNote.create({
            data: {
                content: content,
                botId: botId,
                botName: botName,
                userId: token.id, // Associate the note with the user
            },
        });

        // Return the unique ID of the newly created note
        res.status(200).json({ noteId: newSharedNote.id });
    } catch (error) {
        console.error("Failed to create shared note:", error);
        res.status(500).json({ message: 'Failed to create shareable link.' });
    }
}