const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Enable CORS for your Vercel domain
  res.setHeader('Access-Control-Allow-Origin', 'https://qamar-abbas.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Send email using Resend's onboarding domain (no custom domain needed)
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Free onboarding domain
      to: ['codewithbismillah@gmail.com'], // Your Gmail where you'll receive messages
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="color: #e3f2fd; margin: 10px 0 0 0;">From your portfolio website</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <div style="background: #f1f3f4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h2>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 2px solid #e1e5e9; border-radius: 8px;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Message:</h3>
              <div style="line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
              <p style="margin: 0; color: #2e7d32;"><strong>Quick Reply:</strong> Just hit reply to respond directly to ${name}</p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              Sent from <a href="https://qamar-abbas.vercel.app" style="color: #667eea;">qamar-abbas.vercel.app</a>
            </p>
          </div>
        </div>
      `,
      reply_to: email, // This allows you to reply directly to the sender
    });

    console.log('Email sent successfully:', data.id);
    
    res.status(200).json({ 
      message: 'Email sent successfully!', 
      id: data.id 
    });

  } catch (error) {
    console.error('Resend API Error:', error);
    
    // Handle specific Resend errors
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        message: 'Email service configuration error' 
      });
    }
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to send email. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
