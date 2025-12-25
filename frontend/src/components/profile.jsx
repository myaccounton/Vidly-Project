import React, { useEffect, useState } from "react";
import auth from "../services/authService";
import { getWatchlist } from "../services/watchlistService";
import { getCustomers } from "../services/customerService";

const Profile = () => {
  const user = auth.getCurrentUser();
  const watchlistCount = getWatchlist().length;

  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    async function fetchGoldStatus() {
       if (user?.isAdmin) {
        setIsGold(false);
        return;
       }

      if (!user || !user.email){
        setIsGold(false);
        return;
      }

      const { data: customers } = await getCustomers();
      const customer = customers.find(
        c => c.email === user.email
      );

      setIsGold(customer ? customer.isGold : false);
    }

    fetchGoldStatus();
  }, [user]);

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
