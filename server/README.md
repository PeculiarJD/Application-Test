REST API - Registration & Login (JWT)

Project Description: This project is a small REST API that implements secure user authentication. It was built as part of an application test task with the following requirements:
Endpoints:
1. POST /auth/register → Register a new user
2. POST /auth/login → Authenticate user and return JWT
3. GET /users/me → Get current user (JWT protected)

Stack: Implemented with Node.js + Express and PostgreSQL (via Neon)

Deliverables:
GitHub repository
README (setup steps)
Postman collection

Evaluation will focus on:
1. Security (password hashing, JWT protection)
2. Code clarity (clean routes, controllers, middleware)
3. Documentation (README + Postman collection)

Additionally, I added email verification with a 6-digit OTP for extra security (not required but included).

Features
1. User resgistration with hashed passwords (bcrypt)
2. Email verification with 6-digit OTP, which expires in 10 minutes
3. Secure login with JWT
4. Protected route: /users/me
5. PostgreSQL database hosted on Neon
6. Nodemailer with Gmail for email delivery

Setup Steps
1. Clone the Repo
git clone https://github.com/
cd https://github.com/ server

2. Install Dependencies - In the terminal type:
npm install

3. Configure Environment
Duplicate .env.example into .env:
cp .env.example .env

4. Run the Server
nodemon server.js

5. You should see:
Connected to PostgreSQL via Neon
Server running on port 5000

API Endpoints
Auth
POST /auth/register - Register user (requires username, email, password)

POST /auth/verify-email - Verify email with OTP

POST /auth/login - Login (returns JWT)

User
GET /users/me - Get logged-in user (JWT required in Authorization header) Authorization: Bearer <token>

Postman Collection
This repo includes a Postman collection - check postman_collection.json

How to Use in Postman
1. Import postman_collection.json into Postman.
2. Open the collection and go to Variables.
3. Update the placeholders:
    BASE_URL → http://localhost:5000
    email, password, username, otp
    token will be filled manually after login.
4. Run requests in this order:
    Register User
    Verify Email (OTP)
    Login → copy returned JWT into {{token}}
    Get Current User

Notes:
Passwords must be at least 8 characters.
OTP expires in 10 minutes.
JWT should be stored securely on the frontend (e.g. HttpOnly cookie).
This project is for demonstration/testing purposes.


## Database Schema
The API uses a single `users` table for authentication and email verification.  
If you are using the provided Neon DB connection string in `.env`, this table already exists.  
There is **no need to create another table** — simply use the connection string as provided.  

For reference, here is the schema:
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
