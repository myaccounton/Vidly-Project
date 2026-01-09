import React from "react";

const PaymentModal = ({ amount, onPay, onClose, disabled = false }) => {
  return (
    <>
      <div
        className="modal-backdrop show"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1040
        }}
        onClick={disabled ? undefined : onClose}
      />
      
      <div
        className="modal d-block"
        style={{ zIndex: 1050 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title mb-0">
                <i className="fas fa-credit-card me-2"></i>
                Payment
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={disabled}
                aria-label="Close"
              />
            </div>

            <div className="modal-body p-4">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <div className="fs-6 text-muted mb-1">Total Amount</div>
                  <div className="display-6 fw-bold text-primary">
                    Rs {amount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => onPay("UPI")}
                  disabled={disabled}
                  style={{ minHeight: "50px" }}
                >
                  <i className="fas fa-mobile-alt me-2"></i>
                  Pay with UPI
                </button>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onPay("Card")}
                  disabled={disabled}
                  style={{ minHeight: "50px" }}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Pay with Card
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => onPay("Cash")}
                  disabled={disabled}
                  style={{ minHeight: "50px" }}
                >
                  <i className="fas fa-money-bill-wave me-2"></i>
                  Cash
                </button>
              </div>
            </div>

            <div className="modal-footer border-top">
              <button
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={disabled}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
