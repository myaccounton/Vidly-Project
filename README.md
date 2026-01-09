# Vidly - Movie Rental Management System

A full-stack web application for managing movie rentals with user authentication, payment processing, and watchlist functionality.

## 🎬 Overview

Vidly is a modern movie rental platform that allows users to browse movies, rent them, manage their rentals, and maintain a personal watchlist. The application features role-based access control with separate interfaces for regular users and administrators.

## ✨ Features

### User Features
- **Movie Browsing**: Browse and search through available movies
- **Movie Rentals**: Rent movies with automatic stock management
- **Rental Management**: View active and returned rentals with payment history
- **Watchlist**: Save movies to a personal watchlist for later
- **User Profile**: Manage personal account information
- **Payment Processing**: Secure payment modal with multiple payment methods (UPI, Card, Cash)
- **Real-time Updates**: Watchlist count updates across browser tabs

### Admin Features
- **Movie Management**: Create, update, and delete movies
- **Rental Overview**: View all rentals across the platform
- **Stock Management**: Automatic inventory tracking
- **User Management**: Access to user accounts and rental history

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for users and admins
- **Rental Limits**: Configurable rental limits based on user membership (Gold/Regular)
- **Payment Calculation**: Automatic fee calculation based on rental duration
- **Error Handling**: Comprehensive error boundaries and validation
- **Responsive Design**: Mobile-friendly Bootstrap UI

## 🛠️ Tech Stack

### Frontend
- **React 16.14** - UI library
- **React Router** - Client-side routing
- **Bootstrap 4** - UI framework
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Joi Browser** - Form validation
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Joi** - Validation
- **Winston** - Logging
- **Helmet** - Security
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Vidly/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Custom middleware (auth, error handling)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── startup/         # Application startup logic
│   ├── tests/           # Unit and integration tests
│   └── utils/           # Utility functions
│
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       │   ├── common/  # Reusable components
│       ├── services/    # API service layer
│       └── utils/       # Utility functions
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vidly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost/vidly
   jwtPrivateKey=your-secret-key
   PORT=3001
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure API URL**
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3001`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application opens at `http://localhost:3000`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

The application can be deployed to platforms like Render, Heroku, or Vercel. See `DEPLOYMENT.md` for detailed deployment instructions.

### Environment Variables for Production
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `jwtPrivateKey` - Secure JWT secret key
- `REACT_APP_API_URL` - Backend API URL

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid authentication
- Admin routes require admin privileges
- Tokens expire and require re-authentication

## 📊 API Endpoints

### Authentication
- `POST /api/auth` - Register new user
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Rentals
- `GET /api/rentals` - Get all rentals (Admin)
- `GET /api/rentals/my` - Get user's rentals
- `POST /api/rentals` - Create rental
- `POST /api/rentals/:id/return` - Return rental with payment

### Watchlist
- `GET /api/watchlists` - Get user's watchlist
- `POST /api/watchlists` - Add to watchlist
- `DELETE /api/watchlists/:id` - Remove from watchlist

## 🎯 Key Features Implementation

### Payment System
- Calculates rental fees based on days rented
- Supports multiple payment methods (UPI, Card, Cash)
- Stores payment history with timestamps
- Automatic stock restoration on return

### Rental Management
- Enforces rental limits (configurable per user type)
- Prevents double returns
- Tracks rental history
- Real-time stock updates

### Watchlist
- LocalStorage-based for instant access
- Syncs across browser tabs
- Badge count in navigation
- Server-side persistence option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Developed as a full-stack web application project demonstrating modern web development practices.

## 🙏 Acknowledgments

- Built following Mosh Hamedani's Vidly course structure
- Enhanced with additional features including payment processing, watchlist, and improved UI/UX

---

**Note**: This project was originally designed as a store-managed rental system and later refactored to allow authenticated users to rent movies directly. The customers module is retained for compatibility but is not exposed in the UI.

