# 📝 BlogBlaze - MERN Stack Blogging Platform

A full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It supports user authentication, blog creation, rich content editing, admin dashboard, and Google OAuth login.

---

## 🚀 Features

### 🔐 Authentication
- Email/password-based signup and login
- Forgot password & reset password
- JWT-based session management

### ✍️ Blogging
- Create, edit, delete blog posts
- Upload and embed images using Cloudinary
- Rich text editor (with markdown/HTML support)
- Blog categorization and tagging
- Like and comment on posts
- View most liked/commented blogs as featured posts on homepage

### 👤 User Dashboard
- Update username, email, and password
- View personal blog posts
- Delete account

### 🛠️ Admin Panel
- View and manage all users
- Delete any user, blog post, or comment
- Analytics (Coming Soon)

---

## 🧱 Tech Stack

| Layer        | Tech                               |
|-------------|------------------------------------|
| Frontend     | React, Redux Toolkit, Axios, React Router |
| Backend      | Node.js, Express.js, MongoDB, Mongoose |
| Auth         | JWT, Bcrypt.js,  |
| Cloud Storage| Cloudinary (for blog images)       |
| Styling      | TailwindCSS + Lucide Icons         |

---

## 🌐 Live Demo

> 🔗 Coming soon...

---

## ⚙️ Installation & Setup
Clone the project

### 🔧 Backend Setup

```bash
cd backend
npm install

UPDATE .env FILE IN BACKEND

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SENDGRID_API_KEY=sendgrid_email_api key
EMAIL_FROM=your_company_email
FRONTEND_URL=http://localhost:3000

🖥️ Frontend Setup
bash
cd frontend
npm install
Start the client:

npm run dev

###FOLDER STRUCTURE

📦 root
├── backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── .env
│   └── server.js
└── frontend
    ├── components/
    ├── pages/
    ├── redux/
    ├── App.jsx
    └── main.jsx


