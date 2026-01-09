import React from "react";

const PaymentModal = ({ amount, onPay, onClose }) => {
  return (
    <div className="modal-backdrop show">
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <h5>Mock Payment</h5>
            <p>Total Amount: <strong>Rs {amount}</strong></p>

            <button className="btn btn-success w-100 mb-2"
              onClick={() => onPay("UPI")}>
              Pay with UPI
            </button>

            <button className="btn btn-primary w-100 mb-2"
              onClick={() => onPay("Card")}>
              Pay with Card
            </button>

            <button className="btn btn-secondary w-100"
              onClick={() => onPay("Cash")}>
              Cash
            </button>

            <button className="btn btn-link mt-2"
              onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
