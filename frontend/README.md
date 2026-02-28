# Vidly Frontend

React-based frontend application for the Vidly movie rental management system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Development
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `build` folder.

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components
│   │   ├── form.jsx
│   │   ├── input.jsx
│   │   ├── passwordInput.jsx
│   │   ├── protectedRoute.jsx
│   │   └── ...
│   ├── movies.jsx      # Movie listing and search
│   ├── movieForm.jsx   # Movie creation/editing (Admin)
│   ├── myRentals.jsx   # User rental management
│   ├── paymentModal.jsx # Payment processing modal
│   ├── watchlist.jsx   # User watchlist
│   └── ...
├── services/           # API service layer
│   ├── authService.js
│   ├── movieService.js
│   ├── rentalService.js
│   └── ...
├── utils/             # Utility functions
└── App.js             # Main application component
```

## 🎨 Key Features

### Components
- **Movies**: Browse and search movies with pagination
- **My Rentals**: View active and returned rentals with payment history
- **Payment Modal**: Secure payment interface with multiple payment methods
- **Watchlist**: Personal movie watchlist with localStorage persistence
- **Profile**: User account management
- **Protected Routes**: Authentication and authorization guards

### State Management
- React Hooks (useState, useEffect) for component state
- Context API for global state (if needed)
- localStorage for persistent data (watchlist, auth tokens)

### Routing
- React Router v5 for client-side routing
- Protected routes for authenticated users
- Admin-only routes for administrative functions

### UI/UX
- Bootstrap 4 for responsive design
- React Toastify for user notifications
- Font Awesome icons
- Custom modal components
- Error boundaries for error handling

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **bootstrap** - CSS framework
- **react-toastify** - Notifications
- **jwt-decode** - JWT token decoding

## 🏗️ Architecture Notes

This project was bootstrapped with Create React App. The application follows a component-based architecture with:

- **Service Layer**: Abstracts API calls from components
- **Reusable Components**: Common UI elements in `components/common/`
- **Route Protection**: Custom route components for authentication
- **Error Handling**: Error boundaries and try-catch blocks
- **Form Validation**: Client-side validation with Joi

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Tokens are automatically included in API requests
- Protected routes check for valid authentication
- Admin routes verify admin privileges
- Automatic logout on token expiration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

Bootstrap's responsive utilities ensure optimal viewing across all screen sizes.

## 🐛 Troubleshooting

### API Connection Issues
- Verify `REACT_APP_API_URL` in `.env` file
- Ensure backend server is running
- Check CORS configuration on backend

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `npm run build -- --no-cache`

### Port Already in Use
- Change port by setting `PORT=3001` in `.env` or command line

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [Create React App Documentation](https://create-react-app.dev/)

---

For the complete project documentation, see the main [README.md](../README.md) file.
