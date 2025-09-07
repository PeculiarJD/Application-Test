import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export const sendVerificationEmail = async (to, code) => {
    await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Email Verification Code",
        html: `<p>Your verification code is:</p><h2>${code}</h2>`,
    });
};
