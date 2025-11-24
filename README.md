# 🖥️ MERN Blog Backend

[![Backend](https://img.shields.io/badge/backend-Node.js-orange)]()
[![Framework](https://img.shields.io/badge/framework-Express.js-blue)]()
[![Database](https://img.shields.io/badge/database-MongoDB-green)]()
[![Authentication](https://img.shields.io/badge/authentication-JWT-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-success)]()

This is the **backend** of the MERN Blog Web Application.  
It provides **RESTful API endpoints** for user authentication, blog post CRUD operations, and role-based access control.

---

## 🚀 Features

- 🔑 **User Authentication:** JWT-based signup/login + Google OAuth  
- ✍️ **CRUD Operations:** Create, read, update, delete blog posts  
- 🏷️ **Categories & Tags:** Organize blog posts   
- ☁️ **Cloud Image Upload:** Optional with Cloudinary  

---

## 🛠️ Tech Stack

| Backend | Database | Authentication | Other Tools |
|---------|---------|----------------|-------------|
| Node.js | MongoDB | JWT | Mongoose, bcrypt, Cloudinary |
| Express.js |  |  | dotenv, cors, nodemon |

---

## ⚡ Installation

1. **Clone the repository**

```bash
git clone https://github.com/savindi2003/blog-app-backend.git
cd blog-backend
```

2. **Install dependencies**
   
```bash
npm install
```

3. **Create a `.env` file with the following:**
   
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url 
```

4. **Start the server**
   
```bash
npm run dev
```
Server runs at `http://localhost:5000`

---

## 📌 API Routes

### 🔑 Auth
```http
POST /api/auth/register        → Register a new user
POST /api/auth/login           → Login and get JWT token
POST /api/auth/google          → Sign in / Sign up with Google OAuth
```

### 👤 Users
```http
GET /api/auth/:id               → Get logged in user details
PUT /api/auth/update/:id        → Update user
```

### 📝 Blogs
```http
GET    /api/posts/               → Get all blog posts
GET    /api/posts/:id            → Get single blog post
POST   /api/posts/               → Create new blog post
PUT    /api/posts/:id            → Update blog post
DELETE /api/posts/:id            → Delete blog post

GET    /api/posts/search/:title                → Search By Title
GET    /api/posts/category/:category           → Search By Category

PUT    /api/posts/:id/like                → Like Unlike Post
POST   /api/posts/:postId/comment         → Add a comment
GET    /api/posts/:postId/comments        → Get Comments for each posts
```

--- 

## 🖥️ Frontend Setup

Frontend code is implemented in **React.js** and hosted in a separate repository:

[Frontend Repository](https://github.com/savindi2003/mern-blog-app.git)




