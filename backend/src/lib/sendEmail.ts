import { sender, transport } from "../config/mailtrap";

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await transport.sendMail({
      from: sender,
      to,
      subject,
      html,
    });

    console.log("Email send successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
