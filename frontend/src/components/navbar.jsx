import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getWatchlist } from "../services/watchlistService";

const NavBar = ({ user }) => {
  const [watchlistCount, setWatchlistCount] = useState(
    getWatchlist().length
  );

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };

    // Works across tabs
    window.addEventListener("storage", updateCount);

    // Works in same tab (custom event)
    window.addEventListener("watchlistUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("watchlistUpdated", updateCount);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Vidly
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#vidlyNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="vidlyNavbar">
          <ul className="navbar-nav me-auto">
  <li className="nav-item">
    <NavLink className="nav-link" to="/movies">
      Movies
    </NavLink>
  </li>

  {/* USER ONLY */}
  {user && !user.isAdmin && (
    <li className="nav-item">
      <NavLink className="nav-link" to="/my-rentals">
        My Rentals
      </NavLink>
    </li>
  )}

 {user?.isAdmin && (
  <>
    <li className="nav-item">
      <NavLink className="nav-link" to="/customers">
        Customers
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink className="nav-link" to="/rentals">
        Rentals
      </NavLink>
    </li>
  </>
)}


  {/* WATCHLIST */}
  {user && (
    <li className="nav-item">
      <NavLink className="nav-link" to="/watchlist">
        Watchlist
        {watchlistCount > 0 && (
          <span className="badge bg-secondary ms-2">
            {watchlistCount}
          </span>
        )}
      </NavLink>
    </li>
  )}
</ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    {user.name}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
