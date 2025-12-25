import React, { useEffect, useState } from "react";
import { getRentals } from "../services/rentalService";

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRentals() {
      try {
        const { data } = await getRentals();
        setRentals(data);
      } catch (ex) {
        console.error("Failed to load rentals:", ex);
      } finally {
        setLoading(false);
      }
    }
    fetchRentals();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading rentals...</p>
      </div>
    );

  if (rentals.length === 0)
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h5 className="text-muted mb-3">No Rentals Found</h5>
            <p className="text-muted">There are no rentals in the system yet.</p>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>All Rentals</h3>
        <span className="badge bg-secondary">{rentals.length} total</span>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Movie</th>
            <th>Date Out</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map(rental => (
            <tr key={rental._id}>
              <td>{rental.customer.name}</td>
              <td>{rental.movie.title}</td>
              <td>
                {new Date(rental.dateOut).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Rentals;
