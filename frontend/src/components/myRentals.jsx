import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRentals from "../hooks/useRentals";
import PaymentModal from "./paymentModal";
import { toast } from "react-toastify";
import TableSkeleton from "./common/tableSkeleton";
import Skeleton from "./common/skeleton";

const MyRentals = () => {
  const { user } = useAuth();
  const {
    activeRentals,
    returnedRentals,
    loading,
    returning,
    handleReturn,
    calculateAmount,
  } = useRentals(!!user);

  const [selectedRental, setSelectedRental] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

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

    try {
      await handleReturn(selectedRental._id, paymentMethod);
      setShowPayment(false);
      setSelectedRental(null);
    } catch (ex) {
      // Error is already handled in the hook
    }
  };

  if (loading)
    return (
      <div className="mt-4">
        <Skeleton width="150px" height="32px" className="mb-4" />
        <div className="card shadow-sm mb-4">
          <div className="card-body p-0">
            <TableSkeleton rows={4} columns={5} />
          </div>
        </div>
      </div>
    );

  if (!user)
    return <p className="mt-3">Please login to view your rentals.</p>;

  if (activeRentals.length === 0 && returnedRentals.length === 0)
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
