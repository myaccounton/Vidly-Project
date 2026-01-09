import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Watchlist from "./components/watchlist";
import Movies from "./components/movies";
import MovieForm from "./components/movieForm";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navbar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import RentalForm from "./components/rentalForm";
import MyRentals from "./components/myRentals";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminRoute from "./components/common/adminRoute";
import ErrorBoundary from "./components/common/errorBoundary";
import Logout from "./components/logout";
import Profile from "./components/profile";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    updateUser();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateUser = () => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
  };

  const handleStorageChange = () => {
    updateUser();
  };

  return (
    <ErrorBoundary>
      <ToastContainer />
      <NavBar user={user} />
      <main className="container mt-3">
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <ProtectedRoute path="/movies/:id" component={MovieForm} />
          <Route 
            path="/movies"
            render={props => <Movies {...props} user={user} />} 
          />
          <ProtectedRoute path="/rentals/new" component={RentalForm} />
          <Route
            path="/my-rentals"
            render={props =>
              user ? <MyRentals {...props} /> : <Redirect to="/login" />
            } 
          />
          <AdminRoute path="/rentals" component={Rentals} />
          <Route path="/not-found" component={NotFound} />
          <Route
            path="/watchlist"
            render={props => user ? <Watchlist {...props} /> : <Redirect to="/login" />}
          />
          <Route path="/profile" component={Profile} />
          <Route path="/customers" component={NotFound} />
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </ErrorBoundary>
  );
}

export default App;
