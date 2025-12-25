import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../services/customerService";
import auth from "../services/authService";

const Customers = () => {
  const user = auth.getCurrentUser();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data } = await getCustomers();
        setCustomers(data);
      } catch (ex) {
        console.error("Failed to load customers:", ex);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading customers...</p>
      </div>
    );

  const handleDelete = async customer => {
    await deleteCustomer(customer._id);
    setCustomers(customers.filter(c => c._id !== customer._id));
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
