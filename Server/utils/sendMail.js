import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_KEY);

const sendEmail = async (Email, FirstName, otp) => {
  try {
    const response = await resend.emails.send({
      from: "Eduahaven <noreply@eduhaven.online>",
      to:Email,
      subject: "Confirm your Email Address – Eduahaven",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #4A90E2;">Hello ${FirstName},</h2>
          <p style="font-size: 16px; color: #333333;">
            Thanks for signing up for <strong>Eduahaven</strong>! To verify your email address, please use the OTP below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f5f5f5; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #222; letter-spacing: 3px; border-radius: 6px;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #777777;">
            This code will expire in 10 minutes. If you didn’t request this email, you can safely ignore it.
          </p>

          <p style="font-size: 16px; color: #333333;">Welcome aboard, <br/>The Eduahaven Team</p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />

          <p style="font-size: 12px; color: #999999; text-align: center;">
            You received this email because you signed up for Eduahaven. If this wasn't you, please disregard this message.
          </p>
        </div>
      `,
    });

    console.log("Email sent!", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;