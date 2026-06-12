import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'JobFlow <noreply@jobflow.com>',
      to: email,
      subject: 'Welcome to JobFlow – Start Tracking Your Career Journey 🚀',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to JobFlow</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 30px;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              border-radius: 12px;
              color: white;
              font-weight: bold;
              font-size: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              color: #111827;
            }
            .header p {
              margin: 8px 0 0;
              font-size: 16px;
              color: #6b7280;
            }
            .content {
              padding: 30px 0;
            }
            .greeting {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
              color: #111827;
            }
            .message {
              font-size: 16px;
              color: #4b5563;
              margin-bottom: 24px;
              line-height: 1.7;
            }
            .features {
              background-color: #f8fafc;
              padding: 24px;
              border-radius: 8px;
              margin: 24px 0;
            }
            .features h3 {
              margin: 0 0 16px;
              font-size: 18px;
              font-weight: 600;
              color: #111827;
            }
            .features ul {
              margin: 0;
              padding-left: 20px;
            }
            .features li {
              margin-bottom: 8px;
              color: #4b5563;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              color: white;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              margin-top: 24px;
              transition: transform 0.2s;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .footer p {
              margin: 4px 0;
            }
            .footer a {
              color: #4b5563;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">JF</div>
              <h1>Welcome to JobFlow</h1>
              <p>Your career journey starts here</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi${name ? ' ' + name : ''}! 👋</p>
              <p class="message">
                Welcome to JobFlow! We're thrilled to have you on board. You've just taken a great step towards organizing and accelerating your job search.
              </p>
              
              <div class="features">
                <h3>What you can do with JobFlow:</h3>
                <ul>
                  <li>📊 Track all your job applications in one place</li>
                  <li>📋 Organize your pipeline with a Kanban board</li>
                  <li>📅 Schedule and manage interviews</li>
                  <li>📝 Keep preparation notes for each opportunity</li>
                  <li>📈 Monitor your progress with detailed analytics</li>
                </ul>
              </div>
              
              <p class="message">
                Ready to take control of your career? Head over to your dashboard and start adding your first application.
              </p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">Go to Dashboard</a>
            </div>
            
            <div class="footer">
              <p>Need help? Contact us at support@jobflow.com</p>
              <p>You're receiving this email because you signed up for JobFlow.</p>
              <p>© 2024 JobFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
