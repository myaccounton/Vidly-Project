import React from "react";
import Joi from "joi";

const Form = ({
  data,
  setData,
  errors,
  setErrors,
  schema,
  onSubmit,
  children
}) => {
  const validate = () => {
    const joiSchema = Joi.object(schema);
    const { error } = joiSchema.validate(data, { abortEarly: false });

    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const validateProperty = ({ name, value }) => {
    if (!schema[name]) return null; 

    const obj = { [name]: value };
    const fieldSchema = Joi.object({ [name]: schema[name] });

    const { error } = fieldSchema.validate(obj);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    onSubmit();
  };

  const handleChange = ({ currentTarget: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);

    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    setErrors(newErrors);
    setData({ ...data, [input.name]: input.value });
  };

  const enhancedChildren = React.Children.map(children, child => {
    if (!child || !child.props?.name) return child;

    return React.cloneElement(child, {
      value: data[child.props.name],
      onChange: handleChange,
      error: errors[child.props.name]
    });
  });

  return <form onSubmit={handleSubmit}>{enhancedChildren}</form>;
};

export default Form;
