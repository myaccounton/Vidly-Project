import React, { useEffect, useState } from "react";
import { getMyRentals, returnRental } from "../services/rentalService";
import auth from "../services/authService";
import { toast } from "react-toastify";

const MyRentals = () => {
  const user = auth.getCurrentUser();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);

  const [selectedRental, setSelectedRental] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

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

    if (user) loadRentals();
    else setLoading(false);
  }, [user]);

  /* ---------------- RETURN FLOW ---------------- */

  const handleReturnClick = (rental) => {
    if (rental.dateReturned) {
      toast.error("This movie has already been returned.");
      return;
    }

    setSelectedRental(rental);
    setShowPayment(true);
  };

  const handlePayment = async (paymentMethod) => {
    if (!selectedRental) return;

    setReturning(true);
    try {
      await returnRental(selectedRental._id, paymentMethod);
      toast.success("Payment successful. Movie returned!");

      const { data } = await getMyRentals();
      setRentals(data);
    } catch (ex) {
      toast.error(ex.response?.data || "Payment failed.");
    } finally {
      setReturning(false);
      setShowPayment(false);
      setSelectedRental(null);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-3">Loading your rentals...</p>
      </div>
    );

  if (!user)
    return <p className="mt-3">Please login to view your rentals.</p>;

  if (rentals.length === 0)
    return (
      <div className="mt-4 text-muted">
        <h5>No rentals yet</h5>
        <p>Rent a movie to see it here 🎬</p>
      </div>
    );

  const activeRentals = rentals.filter(r => !r.dateReturned);
  const returnedRentals = rentals.filter(r => r.dateReturned);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="mt-4">
      <h3 className="mb-4">My Rentals</h3>

      {/* ACTIVE RENTALS */}
      {activeRentals.length > 0 && (
        <>
          <h5 className="mb-3">Active Rentals</h5>
          <div className="card shadow-sm mb-4">
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
                          onClick={() => handleReturnClick(rental)}
                          disabled={returning}
                        >
                          Return
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

      {/* RETURNED RENTALS */}
      {returnedRentals.length > 0 && (
        <>
          <h5 className="mb-3">Returned Rentals</h5>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Date Rented</th>
                    <th>Date Returned</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedRentals.map(rental => (
                    <tr key={rental._id}>
                      <td>{rental.movie.title}</td>
                      <td>{new Date(rental.dateOut).toLocaleDateString()}</td>
                      <td>{new Date(rental.dateReturned).toLocaleDateString()}</td>
                      <td>Rs {rental.payment?.amount}</td>
                      <td>
                        <span className="badge bg-secondary">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MOCK PAYMENT MODAL */}
      {showPayment && selectedRental && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog">
              <div className="modal-content p-4">
                <h5 className="mb-3">Mock Payment</h5>

                <p><strong>{selectedRental.movie.title}</strong></p>
                <p>Rate: Rs {selectedRental.movie.dailyRentalRate}/day</p>

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={() => handlePayment("UPI")}
                  disabled={returning}
                >
                  Pay with UPI
                </button>

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => handlePayment("Card")}
                  disabled={returning}
                >
                  Pay with Card
                </button>

                <button
                  className="btn btn-secondary w-100"
                  onClick={() => handlePayment("Cash")}
                  disabled={returning}
                >
                  Cash
                </button>

                <button
                  className="btn btn-link w-100 mt-2"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
