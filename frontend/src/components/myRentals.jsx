import React, { useEffect, useState } from "react";
import { getMyRentals, returnRental } from "../services/rentalService";
import auth from "../services/authService";
import { toast } from "react-toastify";

const MyRentals = () => {
  const user = auth.getCurrentUser();
  const [rentals, setRentals] = useState([]);
  const [returning, setReturning] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRentals() {
      try {
        const { data } = await getMyRentals();
        setRentals(data);
      } catch (ex) {
        toast.error("Failed to load rentals.");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadRentals();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading your rentals...</p>
      </div>
    );

  const handleReturn = async (rental) => {
    // Prevent returning already returned rentals
    if (rental.dateReturned) {
      toast.error("This movie has already been returned.");
      return;
    }

    if (!window.confirm(`Return "${rental.movie.title}"?`)) return;

    setReturning(true);
    try {
      await returnRental({ movieId: rental.movie._id });
      toast.success("Movie returned successfully!");
      // Reload rentals to update status
      const { data } = await getMyRentals();
      setRentals(data);
    } catch (ex) {
      const errorMessage = ex.response?.data || "Failed to return movie.";
      toast.error(errorMessage);
    } finally {
      setReturning(false);
    }
  };

  if (!user)
    return <p className="mt-3">Please login to view your rentals.</p>;

  // Filter active rentals (not returned)
  const activeRentals = rentals.filter(r => !r.dateReturned);
  const returnedRentals = rentals.filter(r => r.dateReturned);

  if (rentals.length === 0)
    return (
      <div className="mt-4 text-muted">
        <h5>No rentals yet</h5>
        <p>Rent a movie to see it here 🎬</p>
      </div>
    );

  return (
    <div className="mt-4">
      <h3 className="mb-4">My Rentals</h3>

      {activeRentals.length > 0 && (
        <>
          <h5 className="mt-3 mb-3">Active Rentals</h5>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Date Rented</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeRentals.map(rental => (
                <tr key={rental._id}>
                  <td>{rental.movie.title}</td>
                  <td>{new Date(rental.dateOut).toLocaleDateString()}</td>
                  <td>Rs {rental.movie.dailyRentalRate}/day</td>
                  <td>
                    <span className="badge bg-success">Rented</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleReturn(rental)}
                      disabled={returning || rental.dateReturned}
                    >
                      {returning ? "Returning..." : "Return"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </>
      )}

      {returnedRentals.length > 0 && (
        <>
          <h5 className="mt-4 mb-3">Returned Rentals</h5>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Date Rented</th>
                <th>Date Returned</th>
                <th>Rental Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returnedRentals.map(rental => (
                <tr key={rental._id}>
                  <td>{rental.movie.title}</td>
                  <td>{new Date(rental.dateOut).toLocaleDateString()}</td>
                  <td>{new Date(rental.dateReturned).toLocaleDateString()}</td>
                  <td>Rs {rental.rentalFee?.toFixed(2) || "0.00"}</td>
                  <td>
                    <span className="badge bg-secondary">Returned</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyRentals;
