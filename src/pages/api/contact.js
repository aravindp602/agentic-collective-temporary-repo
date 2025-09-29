// src/pages/api/contact.js

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const contactEmail = process.env.CONTACT_FORM_EMAIL_TO;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, honeypot } = req.body;

  // --- 1. HONEYPOT SPAM CHECK ---
  // If this invisible field is filled out, it's almost certainly a bot.
  // We send a success response to trick the bot but do not send an email.
  if (honeypot) {
    console.log('Honeypot field filled, likely spam.');
    return res.status(200).json({ message: 'Message sent successfully!' });
  }

  // --- 2. BASIC VALIDATION ---
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  // Server-side check to ensure the destination email is configured
  if (!contactEmail) {
      console.error("CRITICAL: Missing CONTACT_FORM_EMAIL_TO environment variable on the server.");
      return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    // --- 3. SEND THE EMAIL ---
    await resend.emails.send({
      from: 'onboarding@resend.dev', // This is a required sender for Resend's free tier.
      to: contactEmail,
      subject: `New Contact Form Submission from ${name}`,
      reply_to: email, // This allows you to click "Reply" in your email client to respond directly to the user.
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="margin-top: 0;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <h3 style="margin-bottom: 10px;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
}