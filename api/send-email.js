// This is your backend API endpoint (Node.js/Express example)
// You can also use this with Next.js API routes, Vercel Functions, or any other backend

const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Send email using Resend
    const data = await resend.emails.send({
      from: 'contact@yourdomain.com', // Replace with your verified domain
      to: ['qamar'], // Replace with your email
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      // Optional: Send a copy to the sender
      reply_to: email,
    });

    // Optional: Send confirmation email to the sender
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: [email],
      subject: 'Thank you for contacting me!',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. I've received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Qamar Abbas</p>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}

module.exports = handler;
