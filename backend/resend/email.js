import { resend } from "./config.js";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Verify your email address",
            html: "Verify your email with this Token: " + verificationToken,
        });
        
        if (error) {
            console.error("Resend API error (verification):", error);
            throw new Error("Failed to send verification email");
        }
    } catch (error) {
        console.log("Error sending verification email:", error);
        throw error;
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
    // attempt to send welcome email
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to our company",
            html: "Welcome " + name + "! Hope you have a great time using our app.",
        });
        
        if (error) {
            console.error("Resend API error (welcome):", error);
            throw new Error("Failed to send welcome email");
        }
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error;
    }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
    // attempt to send welcome email
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your password",
            html: `
                <p>Hello,</p>
                <p>Click the link below to reset your password:</p>
                <p><a href="${resetURL}" target="_blank" rel="noopener noreferrer">Reset your password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
            `,
        });
        
        if (error) {
            console.error("Resend API error (welcome):", error);
            throw new Error("Failed to send reset password email");
        }
    } catch (error) {
        console.error("Error sending reset password email:", error);
        throw error;
    }

}
export const sendResetSucessEmail = async (email) => {
     try {
    // attempt to send welcome email
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reseted successfully your password",
            html: `your password has been reset successfully.`,
        });
        
        if (error) {
            console.error("sendResetSucessEmail API error :", error);
            throw new Error("Failed to send reset password sucessed email");
        }
    } catch (error) {
        console.error("Failed to send reset password sucessed email:", error);
        throw error;
    }
}