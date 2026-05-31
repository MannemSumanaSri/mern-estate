# 🏡 MERN Estate

A full-stack real estate marketplace built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). The platform allows users to browse, search, create, update, and manage property listings for sale or rent through a modern and responsive web interface.

## 🚀 Live Demo

https://mern-estate-pisr.onrender.com

---

## 📖 Project Overview

MERN Estate is a real estate web application designed to simplify property discovery and management. Users can create accounts, securely log in, manage their profiles, post property listings, upload images, and search for properties using multiple filters.

The project demonstrates full-stack development concepts including authentication, authorization, REST APIs, database management, state management, and responsive UI design.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User Registration and Login
- JWT Authentication
- Secure Password Hashing using bcryptjs
- Google OAuth Authentication
- Protected Routes

### 👤 User Profile Management
- Update Profile Information
- Upload Profile Picture
- View Personal Listings
- Delete Account

### 🏠 Property Listings
- Create New Listings
- Update Existing Listings
- Delete Listings
- Upload Property Images
- View Detailed Property Information

### 🔍 Search & Filters
- Search Properties by Name
- Filter by Rent or Sale
- Filter by Furnished Properties
- Filter by Parking Availability
- Filter by Offers
- Sort Search Results

### 📱 Responsive Design
- Mobile-Friendly Layout
- Modern User Interface
- Optimized User Experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose

### Authentication
- Firebase Google OAuth
- JSON Web Tokens (JWT)

### Deployment
- Render

---

## 🏗️ Architecture

```text
React Frontend
      │
      ▼
Express REST API
      │
      ▼
MongoDB Database
      │
      ▼
JWT Authentication
```

---

## 📂 Folder Structure

```text
mern-estate/
│
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/MannemSumanaSri/mern-estate.git
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_api_key
```

---

## ▶️ Run the Project

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🎯 Skills Demonstrated

- Full Stack Web Development
- REST API Development
- Authentication & Authorization
- MongoDB Database Design
- Redux State Management
- CRUD Operations
- Responsive Web Design
- Deployment and Hosting

---

## 💡 Challenges Solved

### Secure User Authentication
Implemented JWT-based authentication and protected routes to ensure secure access to user-specific resources.

### State Management
Used Redux Toolkit for centralized and efficient application state management.

### Dynamic Property Search
Built filtering and sorting functionality to help users quickly find relevant properties.

### Property Management
Implemented complete CRUD operations for property listings with image support.

---

## 🚀 Future Enhancements

- Property Wishlist
- Real-Time Chat Between Buyers and Sellers
- Property Reviews and Ratings
- Admin Dashboard
- Email Notifications
- Property Recommendation System
- Payment Integration

---

## 👩‍💻 Author

**Sumana Sri**

GitHub: https://github.com/MannemSumanaSri

---

## 📄 License

This project is intended for educational, learning, and portfolio purposes.

---

## 🎤 Interview Summary

MERN Estate is a full-stack real estate marketplace application where users can securely authenticate, create and manage property listings, search and filter properties, and manage profiles using React, Node.js, Express.js, MongoDB, Redux Toolkit, JWT, and Firebase OAuth.
