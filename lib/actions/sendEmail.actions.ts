'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
        const response = await resend.emails.send({
            from:`EvenTara <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: html || text,
        });
        console.log('Email sent successfully:', response);
        return { success: true, id: response };
    } catch (error: any) {
        console.error('Error sending email:', error.message);
        return { success: false, error: error.message };
    }
}
