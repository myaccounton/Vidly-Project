import React from 'react';

const Select = ({
  name,
  label,
  options,
  valueProperty,
  labelProperty,
  value,
  onChange,
  error
}) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={name}>{label}</label>

      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="form-control"
      >
        <option value="" />
        {options.map(option => (
          <option key={option[valueProperty]} value={option[valueProperty]}>
            {option[labelProperty]}
          </option>
        ))}
      </select>

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
