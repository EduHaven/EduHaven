import { Resend } from "resend";
import dotenv from "dotenv";
import fetch, { Headers, Request, Response } from "node-fetch";

// Set up global fetch objects for Resend
global.Headers = Headers;
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

dotenv.config();
const resend = new Resend(process.env.RESEND_KEY);

const sendEmail = async (Email, FirstName, otp, emailType) => {
  try {
    // different email content based on signupor reset
    const emailContent = {
      signup: {
        subject: "Confirm your Email Address – Eduhaven",
        greeting: `Hello ${FirstName},`,
        message: `Thanks for signing up for <strong>Eduhaven</strong>! To verify your email address, please use the OTP below:`,
        footer: `Welcome aboard, <br/>The Eduhaven Team`,
        disclaimer: `You received this email because you signed up for Eduhaven. If this wasn't you, please disregard this message.`,
      },
      reset: {
        subject: "Password Reset Request – Eduhaven",
        greeting: `Hello ${FirstName},`,
        message: `We received a request to reset your password for your <strong>Eduhaven</strong> account. Please use the OTP below to continue:`,
        footer: `If you didn't request this password reset, please ignore this email. <br/>The Eduhaven Team`,
        disclaimer: `You received this email because a password reset was requested for your Eduhaven account. If this wasn't you, please disregard this message and consider changing your password.`,
      },
    };

    const content = emailContent[emailType] || emailContent.signup;

    const response = await resend.emails.send({
      from: "Eduhaven <noreply@eduhaven.online>",
      to: Email,
      subject: content.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #4A90E2;">${content.greeting}</h2>
          <p style="font-size: 16px; color: #333333;">
            ${content.message}
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f5f5f5; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #222; letter-spacing: 3px; border-radius: 6px;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #777777;">
           This code will expire in ${emailType === "reset" ? "15" : "10"} minutes. If you didn't request this email, you can safely ignore it.
          </p>

          <p style="font-size: 16px; color: #333333;">${content.footer}</p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />

          <p style="font-size: 12px; color: #999999; text-align: center;">
            ${content.disclaimer}
          </p>
        </div>
      `,
    });

    console.log(`${emailType} email sent!`, response);
  } catch (error) {
    console.error(`Error sending ${emailType} email: `, error);
  }
};

export default sendEmail;
