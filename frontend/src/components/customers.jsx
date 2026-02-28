import React from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../services/customerService";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { toast } from "react-toastify";
import TableSkeleton from "./common/tableSkeleton";
import Skeleton from "./common/skeleton";

const Customers = () => {
  const { user } = useAuth();
  const { data: customers = [], loading, refetch } = useFetch(
    async () => {
      const { data } = await getCustomers();
      return data;
    },
    []
  );

  if (loading)
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Skeleton width="150px" height="32px" />
          <Skeleton width="120px" height="38px" rounded />
        </div>
        <TableSkeleton rows={6} columns={4} />
      </>
    );

  const handleDelete = async (customer) => {
    try {
      await deleteCustomer(customer._id);
      toast.success("Customer deleted successfully");
      refetch();
    } catch (ex) {
      toast.error("Failed to delete customer");
      console.error("Failed to delete customer:", ex);
    }
  };

  if (customers.length === 0)
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h5 className="text-muted mb-3">No Customers Found</h5>
            <p className="text-muted mb-4">Get started by adding your first customer.</p>
            {user?.isAdmin && (
              <Link to="/customers/new" className="btn btn-primary">
                Add Customer
              </Link>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Customers</h3>
        {user?.isAdmin && (
          <Link to="/customers/new" className="btn btn-primary">
            + New Customer
          </Link>
        )}
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Gold</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <Link to={`/customers/${customer._id}`}>
                      {customer.name}
                    </Link>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.isGold ? "Yes" : "No"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(customer)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
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

export default Customers;
