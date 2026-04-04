import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getStatsRevenue, getStatsRentalCount } from "../services/statsService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRentals, setTotalRentals] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [rev, count] = await Promise.all([
          getStatsRevenue(),
          getStatsRentalCount(),
        ]);
        if (!cancelled) {
          setTotalRevenue(rev.totalRevenue);
          setTotalRentals(count.totalRentals);
        }
      } catch (ex) {
        if (!cancelled) {
          toast.error("Failed to load dashboard stats");
          setTotalRevenue(0);
          setTotalRentals(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-100">
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Rental overview from the stats API
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/rentals"
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 no-underline transition hover:border-gray-500 hover:bg-gray-800"
          >
            All rentals
          </Link>
          <Link
            to="/movies"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-blue-700"
          >
            Browse movies
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl bg-gray-800"
              aria-hidden
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total revenue
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              Rs {totalRevenue.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Sum of <code className="text-gray-400">rentalFee</code> across all rentals
            </p>
          </article>

          <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total rentals
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{totalRentals}</p>
            <p className="mt-2 text-sm text-gray-500">
              Count of rental documents in the database
            </p>
          </article>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
