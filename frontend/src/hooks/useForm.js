import React, { useState, useCallback } from 'react';
import Input from "../components/common/input";
import Select from "../components/common/select";
import ImageUpload from "../components/common/imageUpload";

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value, type, files } = event.target;

    // Handle file inputs
    if (type === 'file') {
      const file = value || (files && files[0]) || null;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: file,
      }));
    } else {
      // Handle regular inputs
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = useCallback((callback) => {
    return (event) => {
      event.preventDefault();
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        callback();
      }
    };
  }, [values, validate]);

  const renderInput = useCallback((name, label, type = "text") => (
    <Input
      type={type}
      name={name}
      label={label}
      value={values[name] || ''}
      onChange={handleChange}
      error={errors[name]}
    />
  ), [values, errors, handleChange]);

  const renderSelect = useCallback((name, label, options, valueProperty, labelProperty) => (
    <Select
      name={name}
      label={label}
      options={options || []}
      value={values[name] || ''}
      onChange={handleChange}
      error={errors[name]}
      valueProperty={valueProperty}
      labelProperty={labelProperty}
    />
  ), [values, errors, handleChange]);

  const renderImageUpload = useCallback((name, label, accept = "image/*") => {
    // Check if there's a posterUrl field (for existing images)
    const imageUrl = values[`${name}Url`] || (typeof values[name] === 'string' ? values[name] : null);
    return (
      <ImageUpload
        name={name}
        label={label}
        value={imageUrl}
        onChange={handleChange}
        error={errors[name]}
        accept={accept}
      />
    );
  }, [values, errors, handleChange]);

  const renderButton = useCallback((label) => (
    <button type="submit" className="btn btn-primary">
      {label}
    </button>
  ), []);

  return {
    data: values,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    setData: setValues,
    renderInput,
    renderSelect,
    renderImageUpload,
    renderButton,
  };
};

export default useForm;