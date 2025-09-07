import sql from '../configs/db.js';

export const getMe = async (req, res) => {
    try {
        const users = await sql`
            SELECT id, username, email, is_verified, created_at
            FROM users
            WHERE id = ${req.user.id}
        `;
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
