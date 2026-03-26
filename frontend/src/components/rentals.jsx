import React from "react";
import { getRentals } from "../services/rentalService";
import useFetch from "../hooks/useFetch";
import TableSkeleton from "./common/tableSkeleton";
import Skeleton from "./common/skeleton";

const Rentals = () => {
  const { data: rentals = [], loading } = useFetch(
    async () => {
        const { data } = await getRentals();
      return data;
    },
    []
  );

  if (loading)
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Skeleton width="150px" height="32px" />
          <Skeleton width="80px" height="24px" rounded />
        </div>
        <TableSkeleton rows={6} columns={3} />
      </>
    );

  if (rentals.length === 0)
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h5 className="text-gray-100 mb-3">No Rentals Found</h5>
            <p className="text-gray-400">There are no rentals in the system yet.</p>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-gray-100">All Rentals</h3>
        <span className="badge bg-secondary">{rentals.length} total</span>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th className="text-gray-300">Customer</th>
            <th className="text-gray-300">Movie</th>
            <th className="text-gray-300">Date Out</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map(rental => (
            <tr key={rental._id}>
              <td className="text-gray-200">{rental.customer.name}</td>
              <td className="text-gray-200">{rental.movie.title}</td>
              <td className="text-gray-300">
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
