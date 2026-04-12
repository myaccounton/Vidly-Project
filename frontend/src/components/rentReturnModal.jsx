import React, { useState } from "react";
import { toast } from "react-toastify";
import PaymentModal from "./paymentModal";

const PAYMENT_DELAY_MS = 700;

/**
 * Return flow: show pricing breakdown; collect final payment when remaining > 0.
 */
const RentReturnModal = ({ summary, onClose, onCompleteReturn, disabled }) => {
  const [paying, setPaying] = useState(false);

  if (!summary) return null;

  const {
    movieTitle,
    days,
    totalCost,
    initialPayment,
    remainingAmount,
    requiresFinalPayment,
  } = summary;

  const runFinalPayment = async (paymentMethod) => {
    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, PAYMENT_DELAY_MS));
      toast.success("Payment successful!");
      await onCompleteReturn({
        paymentStatus: "SUCCESS",
        paymentMethod,
      });
    } finally {
      setPaying(false);
    }
  };

  const runNoBalanceReturn = async () => {
    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, PAYMENT_DELAY_MS));
      await onCompleteReturn({
        paymentStatus: "SUCCESS",
      });
    } finally {
      setPaying(false);
    }
  };

  if (!requiresFinalPayment) {
    return (
      <>
        <div
          className="modal-backdrop show"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1040 }}
          onClick={disabled || paying ? undefined : onClose}
        />
        <div
          className="modal d-block"
          style={{ zIndex: 1050 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title mb-0">Return movie</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                  disabled={disabled || paying}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body p-4">
                <p className="fw-semibold">{movieTitle}</p>
                <ul className="list-unstyled small text-muted mb-3">
                  <li>Days: {days}</li>
                  <li>Total: Rs {Number(totalCost).toFixed(2)}</li>
                  <li>Already paid: Rs {Number(initialPayment).toFixed(2)}</li>
                  <li className="text-success">Remaining: Rs 0</li>
                </ul>
                {paying && (
                  <div className="text-center py-2">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    />
                    <span className="ms-2 text-muted small">Completing…</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={disabled || paying}
                  onClick={runNoBalanceReturn}
                >
                  Complete return
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={paying}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <PaymentModal
      title="Pay balance & return"
      movieTitle={movieTitle}
      subtitle={
        <>
          <span className="d-block">
            {days} day{days !== 1 ? "s" : ""} · Total Rs{" "}
            {Number(totalCost).toFixed(2)}
          </span>
          <span className="d-block">
            Paid upfront: Rs {Number(initialPayment).toFixed(2)}
          </span>
        </>
      }
      amount={Number(remainingAmount)}
      onPay={(method) => runFinalPayment(method)}
      onClose={() => !paying && onClose()}
      disabled={disabled || paying}
    />
  );
};

export default RentReturnModal;
