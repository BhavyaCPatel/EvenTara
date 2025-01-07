
interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    try {
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, text, html }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
