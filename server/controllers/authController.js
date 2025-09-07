import sql from '../configs/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../configs/nodemailer.js';

// to generate 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// OTP code expires in 10 minutes
const OTP_EXPIRY_MINUTES = 10; 

// REGISTER
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    if (password.length < 8)
        return res.status(400).json({ message: 'Password must be at least 8 characters' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode(); 
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); 

         const result = await sql`
            INSERT INTO users (username, email, password, verification_token, verification_expires_at)
            VALUES (${username}, ${email}, ${hashedPassword}, ${verificationToken}, ${expiresAt})
            RETURNING id, username, email, is_verified
        `;

        await sendVerificationEmail(email, verificationToken); 

        res.status(201).json({
            message: 'User registered. Please verify your email.',
            user: result[0],
            verification_code_for_testing: verificationToken  //this is for testing in postman
        }); 
    } catch (err) {
        if (err.message.includes('unique constraint')) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// EMAIL VERIFICATION =  Verify email using 6-digit code
export const verifyEmail = async (req, res) => {
    const { email, code } = req.body; 
    if (!email || !code)
        return res.status(400).json({ message: 'Email and verification code are required' });

    try {
        const users = await sql`
            SELECT * FROM users WHERE email = ${email} AND verification_token = ${code}
        `;

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or verification code' });
        }

        const user = users[0];

        if (user.verification_expires_at && new Date(user.verification_expires_at) < new Date()) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        await sql`
            UPDATE users SET is_verified = true, verification_token = null
            WHERE id = ${users[0].id}
        `;

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email and password required' });

    try {
        const users = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;

        if (users.length === 0)
            return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];

        if (!user.is_verified)
            return res.status(401).json({ message: 'Please verify your email first' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
