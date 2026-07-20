import nodemailer from 'nodemailer';

// Create SMTP Transporter (Supports Gmail, SendGrid, Mailgun, custom SMTP)
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  // Fallback to custom SMTP host if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return null;
};

// Send Password Reset OTP to target recipient's specific Gmail address
export const sendPasswordResetEmail = async (recipientEmail, otp) => {
  const transporter = createTransporter();
  const senderUser = process.env.EMAIL_USER || process.env.GMAIL_USER || 'no-reply@careeros.com';

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #090d16; border: 1px solid #10b981; border-radius: 20px; overflow: hidden; color: #ffffff;">
      <div style="background: linear-gradient(135deg, #064e3b 0%, #1e1b4b 100%); padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff;">Career<span style="color: #34d399;">OS</span></h1>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #a7f3d0;">AI Career Platform & Candidate Verification System</p>
      </div>

      <div style="padding: 30px; background: #090d16;">
        <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">Password Reset Request</h2>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">You requested a password reset for your account registered with <strong>${recipientEmail}</strong>. Use the 6-digit OTP code below to verify and set your new password:</p>

        <div style="margin: 25px 0; padding: 20px; background: #022c22; border: 1px dashed #10b981; border-radius: 14px; text-align: center;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #34d399; display: block; font-weight: 700; margin-bottom: 5px;">Your 6-Digit Password Reset OTP</span>
          <span style="font-size: 32px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #6ee7b7;">${otp}</span>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">This OTP code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
      </div>

      <div style="border-top: 1px solid #1e293b; padding: 20px; text-align: center; font-size: 11px; color: #64748b;">
        © 2026 CareerOS Platform. Designed & Engineered by DEV.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"CareerOS Security" <${senderUser}>`,
        to: recipientEmail,
        subject: `🔒 CareerOS Password Reset OTP: ${otp}`,
        html: htmlContent
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Password Reset OTP sent to ${recipientEmail}`);
      return { success: true, dispatched: true };
    } catch (err) {
      console.error(`[EMAIL DISPATCH SMTP ERROR] ${err.message}. Falling back to console/UI preview.`);
    }
  }

  // Simulated fallback logger when SMTP environment is unconfigured
  console.log(`\n======================================================`);
  console.log(`[OTP EMAIL DISPATCH TO RECIPIENT: ${recipientEmail}]`);
  console.log(`Password Reset OTP Code: ${otp}`);
  console.log(`======================================================\n`);
  return { success: true, dispatched: false, simulated: true };
};

// Send 2-Factor Login Verification OTP to target recipient's specific Gmail address
export const sendLoginOtpEmail = async (recipientEmail, otp) => {
  const transporter = createTransporter();
  const senderUser = process.env.EMAIL_USER || process.env.GMAIL_USER || 'no-reply@careeros.com';

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #090d16; border: 1px solid #06b6d4; border-radius: 20px; overflow: hidden; color: #ffffff;">
      <div style="background: linear-gradient(135deg, #0891b2 0%, #1e1b4b 100%); padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff;">Career<span style="color: #67e8f9;">OS</span></h1>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #cffafe;">2-Factor Authentication Login Verification</p>
      </div>

      <div style="padding: 30px; background: #090d16;">
        <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">Sign-In Security Code</h2>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">Someone is attempting to sign in to CareerOS with the email <strong>${recipientEmail}</strong>. Use the 6-digit OTP code below to verify your login:</p>

        <div style="margin: 25px 0; padding: 20px; background: #083344; border: 1px dashed #06b6d4; border-radius: 14px; text-align: center;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #67e8f9; display: block; font-weight: 700; margin-bottom: 5px;">Your 6-Digit Sign-In Verification OTP</span>
          <span style="font-size: 32px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #a5f3fc;">${otp}</span>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">This security code is valid for 10 minutes. If you did not initiate this sign-in, please secure your password immediately.</p>
      </div>

      <div style="border-top: 1px solid #1e293b; padding: 20px; text-align: center; font-size: 11px; color: #64748b;">
        © 2026 CareerOS Platform. Designed & Engineered by DEV.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"CareerOS Security" <${senderUser}>`,
        to: recipientEmail,
        subject: `🔑 CareerOS Sign-In Security OTP: ${otp}`,
        html: htmlContent
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Login OTP sent to ${recipientEmail}`);
      return { success: true, dispatched: true };
    } catch (err) {
      console.error(`[EMAIL DISPATCH SMTP ERROR] ${err.message}. Falling back to console/UI preview.`);
    }
  }

  // Simulated fallback logger when SMTP environment is unconfigured
  console.log(`\n======================================================`);
  console.log(`[OTP EMAIL DISPATCH TO RECIPIENT: ${recipientEmail}]`);
  console.log(`2-Factor Sign-In OTP Code: ${otp}`);
  console.log(`======================================================\n`);
  return { success: true, dispatched: false, simulated: true };
};
