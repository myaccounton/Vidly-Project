import React from 'react';

const Textarea = ({ name, label, error, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>

      <textarea
        {...rest}
        name={name}
        id={name}
        className="form-control"
        rows="3"
      />

      {error && <div className="alert alert-danger mt-1">{error}</div>}
    </div>
  );
};

export default Textarea;
