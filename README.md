# Mentorship Matching Platform

## Overview
The Mentorship Matching Platform is a web-based application designed to connect mentors and mentees based on shared skills, interests, and professional goals. The platform features a robust backend built with Node.js and Express and a somewhat responsive frontend deployed on Vercel.
The project uses a clean, intuitive, and responsive interface using vanilla JS, HTML & CSS (There is no use of any external library and framework for frontend). It has 
________________________________________
Pages:
-	User Registration and Login: A page for users to sign up, log in, and log out securely.
-	Profile Setup: A page where users can create and edit their profiles, specifying their role (mentor or mentee), skills, interests, and a brief bio.
-	User Discovery: A page where users can browse through other users' profiles, with filters for role, skills, interests, etc.
________________________________________
Functionality:
-	User Authentication: Implement secure user registration, login, and logout functionalities with input validation and error handling.
-	Profile Management: Allow users to create, edit, and delete their profiles. Ensure that profile information is accurately displayed and updated.
-	Connection Requests: Enable users to send and receive mentorship requests, accept or decline requests, and manage ongoing mentorship connections.
________________________________________
Database Integration:
-	Setup: Use a relational database to store user information, profiles, and mentorship connections (e.g., PostgreSQL, MySQL).
-	Relationships: Define clear relationships between users, their profiles, and mentorship requests.
-	Data Security: Ensure sensitive information is securely stored and handled, following best practices for data protection.
________________________________________
Edge Case Handling:
-	Input Validation: Validate all user inputs to prevent empty fields, invalid data formats, and security vulnerabilities like SQL injection.
-	Duplicate Prevention: Prevent users from creating duplicate profiles or sending multiple mentorship requests to the same user..
________________________________________
Deployment:
-	Hosting: Deploy the application on a free hosting platform (e.g., Heroku, Vercel, Netlify).
-	Accessibility: Ensure the deployed application is fully functional, responsive, and accessible via a public URL.
-	Environment Variables: Securely manage any API keys or environment variables needed for deployment.
The "About Us" and "Blogs" links in the index page are placeholders for future improvisations.

## Deployment Links
- **Frontend**: [Mentorship Matching Platform Frontend](https://mentorship-matching-platform-frontend.vercel.app/)
- **Backend**: [Mentorship Matching Platform Backend](https://mentorship-matching-platform-backend.vercel.app/)

The backend link is used for API calls in the frontend. For local setup, ensure fetch URLs in the frontend prepend `http://localhost:5000` to API routes.

---

## Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **bcrypt** for password hashing
- **jsonwebtoken** for authentication
- **dotenv** for environment variable management
- **body-parser** for parsing HTTP requests
- **cors** for Cross-Origin Resource Sharing

### Frontend
- Deployed on Vercel (Frontend code not detailed here but tightly integrated with backend API)

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd mentorship-platform-backend
```

### 2. Initialize Node.js Project
```bash
mkdir mentorship-platform-backend
cd mentorship-platform-backend
npm init -y
```

### 3. Install Dependencies
```bash
npm install express bcrypt jsonwebtoken pg dotenv body-parser cors
npm install --save-dev nodemon
```

### 4. Create PostgreSQL Tables
Run the following SQL commands to set up the database schema:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(15) NOT NULL,
  skills TEXT,
  interests TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(10) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Configure Environment Variables
Create a `.env` file in the `backend` folder with the following content for local development:

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=mentorship_matching_platform
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

For online deployment, set the following environment variables on the hosting platform (e.g., Vercel, using neon PostgreSQL):

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret
```

### 6. Run Backend Locally
Start the backend server locally using the following command:
```bash
npm start
```
The server will run at `http://localhost:5000`.

---

## Development Notes

- **Frontend Fetch Calls:**
  - For local development, ensure fetch calls in the frontend prepend `http://localhost:5000` to API routes, e.g., `fetch("http://localhost:5000/api/profiles/delete", ...)`.
  - Remove `vercel.json` files in both frontend and backend for local system setup.

- **Authentication:**
  - Secure authentication is implemented using JWT. Tokens are required for protected routes.

- **Deployment Configuration:**
  - Environment variables (like `DATABASE_URL` and `JWT_SECRET`) must be correctly configured on the hosting platform to ensure seamless backend functionality.
