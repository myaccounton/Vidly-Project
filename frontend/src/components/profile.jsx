import React from "react";
import useAuth from "../hooks/useAuth";
import useWatchlist from "../hooks/useWatchlist";
import useFetch from "../hooks/useFetch";
import { getCustomers } from "../services/customerService";

const Profile = () => {
  const { user } = useAuth();
  const { count: watchlistCount } = useWatchlist();

  const { data: customers = [] } = useFetch(
    async () => {
      const { data } = await getCustomers();
      return data;
    },
    []
  );

  const customer = user?.email
    ? customers.find((c) => c.email === user.email)
    : null;
  const isGold = user?.isAdmin ? false : customer?.isGold || false;

  if (!user)
    return (
      <div className="container mt-4">
        <h4>User not logged in</h4>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Profile</h2>

      <div className="card shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h5 className="card-title mb-3">{user.name}</h5>

          <p className="mb-2">
            <strong>Email:</strong>{" "}
            <span className="text-muted">
              {user.email || "Not available"}
            </span>
          </p>

          <p className="mb-2">
            <strong>Role:</strong>{" "}
            <span className="badge bg-info">
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </p>

          <p className="mb-2">
            <strong>Membership:</strong>{" "}
            {user.isAdmin ? (
              <span className="text-muted">Admin Account</span>
            ) : isGold ? (
              <span className="badge bg-warning text-dark">
                🌟 Gold Member
              </span>
            ) : (
              <span className="badge bg-secondary">
                Regular Member
              </span>
            )}
          </p>

          <p className="mb-3">
            <strong>Watchlist:</strong>{" "}
            <span className="badge bg-secondary">
              {watchlistCount} movies
            </span>
          </p>

          <hr />

          <p className="text-muted mb-0">
            Logged in successfully
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
