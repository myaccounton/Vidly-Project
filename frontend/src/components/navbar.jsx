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

    window.addEventListener("storage", updateCount);
    window.addEventListener("watchlistUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("watchlistUpdated", updateCount);
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <NavLink className="text-2xl font-bold text-white no-underline" to="/">
          Vidly
        </NavLink>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-between md:gap-8">
          <ul className="m-0 flex list-none flex-wrap items-center gap-4 p-0">
            <li>
              <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/movies">
                Movies
              </NavLink>
            </li>

            {user && !user.isAdmin && (
              <li>
                <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/my-rentals">
                  My Rentals
                </NavLink>
              </li>
            )}

            {user?.isAdmin && (
              <>
                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/rentals">
                    Rentals
                  </NavLink>
                </li>
              </>
            )}

            {user && (
              <li>
                <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/watchlist">
                  Watchlist
                  {watchlistCount > 0 && (
                    <span className="ml-2 rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-100">
                      {watchlistCount}
                    </span>
                  )}
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="m-0 flex list-none flex-wrap items-center gap-4 p-0">
            {user ? (
              <>
                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/profile">
                    {user.name}
                  </NavLink>
                </li>

                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/login">
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink className="text-sm font-medium text-gray-300 no-underline hover:text-white" to="/register">
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
