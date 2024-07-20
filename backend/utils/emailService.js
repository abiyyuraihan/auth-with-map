import { Resend } from 'resend';

const resend = new Resend(process.env.RESENDAPI);

export const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: [email],
      subject: 'Verification OTP',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    if (error) {
      console.error("Error sending OTP email:", error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }

    console.log('OTP sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Detailed error sending OTP:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};
