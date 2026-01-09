import React, { useState } from "react";

const PasswordInput = ({ name, label, value, onChange, error }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group position-relative">
      <label htmlFor={name}>{label}</label>

      <input
        type={show ? "text" : "password"}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={"form-control" + (error ? " is-invalid" : "")}
      />

      {/* Font Awesome icon */}
      <span
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "12px",
          top: "38px",
          cursor: "pointer",
          color: "#6c757d"
        }}
      >
        <i className={`fa ${show ? "fa-eye-slash" : "fa-eye"}`} />
      </span>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default PasswordInput;
