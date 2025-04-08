import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token, origin) => {

    const url = origin
  const verifyLink = `${url}/verify/${token}`;
  // https://alert-x-3.onrender.com/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoYXduZmVybnMwMDRAZ21haWwuY29tIiwiaWF0IjoxNzQzMzQwMDU4LCJleHAiOjE3NDMzNDM2NTh9.LN5NaAG190sKO8iucwOclmjfpuXs1bvGdLjFmuie2h8

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "A!ertX ID - Verify Your Email",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f7; border-radius: 10px; text-align: center;">
        
        <!-- Apple Logo -->
        <div style="margin-bottom: 20px;">
          <img src="./vite.svg" alt="Apple Logo" width="50">
        </div>
  
        <!-- Header -->
        <h2 style="color: #1d1d1f; font-weight: 600; font-size: 24px;">Verify Your A!ertX Email</h2>
  
        <!-- Message -->
        <p style="color: #6e6e73; font-size: 16px; line-height: 1.5;">
          Thank you for creating an A!ertX ID. To complete your sign-up, please verify your email address by clicking the button below.
        </p>
  
        <!-- Verify Button -->
        <a href="${verifyLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; font-size: 16px; color: #ffffff; background: #0071e3; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Verify Now
        </a>
  
        <!-- Footer -->
        <p style="color: #86868b; font-size: 14px; margin-top: 30px;">
          If you didn't create this A!ert ID, you can ignore this email.
        </p>
  
        <p style="color: #86868b; font-size: 12px; margin-top: 10px;">
          A!ert. | Marol church road, Andher -E
        </p>
      </div>
    `,
  });
  
};

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

export default sendVerificationEmail
