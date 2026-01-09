import React, { useEffect, useState } from "react";
import { getMyRentals, returnRental } from "../services/rentalService";
import auth from "../services/authService";
import { toast } from "react-toastify";
import PaymentModal from "./paymentModal";

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

  const calculateAmount = (rental) => {
    if (!rental) return 0;
    const days = Math.max(
      1,
      Math.ceil((new Date() - new Date(rental.dateOut)) / (1000 * 60 * 60 * 24))
    );
    return days * rental.movie.dailyRentalRate;
  };

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

  return (
    <div className="mt-4">
      <h3 className="mb-4">My Rentals</h3>

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
                      <td>Rs {rental.payment?.amount?.toFixed(2) || "0.00"}</td>
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

      {showPayment && selectedRental && (
        <PaymentModal
          amount={calculateAmount(selectedRental)}
          onPay={handlePayment}
          onClose={() => {
            setShowPayment(false);
            setSelectedRental(null);
          }}
          disabled={returning}
        />
      )}
    </div>
  );
};

export default MyRentals;
