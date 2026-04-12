import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRentals from "../hooks/useRentals";
import RentReturnModal from "./rentReturnModal";
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
    fetchReturnSummary,
    submitReturn,
  } = useRentals(!!user);

  const [returnSummary, setReturnSummary] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleReturnClick = async (rental) => {
    if (rental.dateReturned) {
      toast.error("This movie has already been returned.");
      return;
    }

    setLoadingSummary(true);
    try {
      const summary = await fetchReturnSummary(rental._id);
      setReturnSummary(summary);
      setShowReturnModal(true);
    } catch (ex) {
      // toast in hook
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSubmitReturn = async (body) => {
    if (!returnSummary?._id) return;
    try {
      await submitReturn(returnSummary._id, body);
      setShowReturnModal(false);
      setReturnSummary(null);
    } catch (ex) {
      // toast in hook
    }
  };

  const closeReturnModal = () => {
    if (returning) return;
    setShowReturnModal(false);
    setReturnSummary(null);
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
    return <p className="mt-3 text-gray-300">Please login to view your rentals.</p>;

  if (activeRentals.length === 0 && returnedRentals.length === 0)
    return (
      <div className="mt-4 text-gray-300">
        <h5 className="text-gray-100">No rentals yet</h5>
        <p className="text-gray-400">Rent a movie to see it here 🎬</p>
      </div>
    );

  return (
    <div className="mt-4">
      <h3 className="mb-4 text-gray-100">My Rentals</h3>

      {activeRentals.length > 0 && (
        <>
          <h5 className="mb-3 text-gray-200">Active Rentals</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="text-gray-300">Movie</th>
                    <th className="text-gray-300">Date Rented</th>
                    <th className="text-gray-300">Pricing</th>
                    <th className="text-gray-300">Status</th>
                    <th className="text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRentals.map((rental) => {
                    const title = rental.movieTitle ?? rental.movie?.title;
                    const rate = rental.dailyRate ?? rental.movie?.dailyRentalRate;
                    const days = rental.days ?? 1;
                    const total = rental.totalCost ?? 0;
                    const paid = rental.initialPayment ?? 0;
                    const due = rental.remainingAmount ?? 0;
                    const returnBlocked = rental.paymentStatus === "PENDING";

                    return (
                      <tr key={rental._id}>
                        <td className="text-gray-200">{title}</td>
                        <td className="text-gray-300">
                          {new Date(rental.dateOut).toLocaleDateString()}
                        </td>
                        <td className="text-gray-300 small">
                          Rs {rate}/day | {days} day{days !== 1 ? "s" : ""} | Total: Rs{" "}
                          {Number(total).toFixed(0)} | Paid: Rs{" "}
                          {Number(paid).toFixed(0)} | Due: Rs{" "}
                          {Number(due).toFixed(0)}
                        </td>
                        <td>
                          {rental.overdue && (
                            <span className="badge bg-danger me-1">Overdue</span>
                          )}
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleReturnClick(rental)}
                            disabled={returning || loadingSummary || returnBlocked}
                            title={
                              returnBlocked
                                ? "Complete outstanding payment first"
                                : undefined
                            }
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {returnedRentals.length > 0 && (
        <>
          <h5 className="mb-3 text-gray-200">Returned Rentals</h5>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="text-gray-300">Movie</th>
                    <th className="text-gray-300">Date Rented</th>
                    <th className="text-gray-300">Date Returned</th>
                    <th className="text-gray-300">Final total</th>
                    <th className="text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedRentals.map((rental) => (
                    <tr key={rental._id}>
                      <td className="text-gray-200">
                        {rental.movieTitle ?? rental.movie?.title}
                      </td>
                      <td className="text-gray-300">
                        {new Date(rental.dateOut).toLocaleDateString()}
                      </td>
                      <td className="text-gray-300">
                        {new Date(rental.dateReturned).toLocaleDateString()}
                      </td>
                      <td className="text-gray-300">
                        Rs {Number(rental.totalCost ?? 0).toFixed(2)}
                      </td>
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

      {showReturnModal && returnSummary && (
        <RentReturnModal
          summary={returnSummary}
          onClose={closeReturnModal}
          onCompleteReturn={handleSubmitReturn}
          disabled={returning}
        />
      )}
    </div>
  );
};

export default MyRentals;
