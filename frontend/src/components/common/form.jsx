import React from "react";
import Joi from "joi-browser";

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
    const options = { abortEarly: false, allowUnknown: true };
    const { error } = Joi.validate(data, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details)
      errors[item.path[0]] = item.message;

    return errors;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const fieldSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, fieldSchema);
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
    if (!child) return null;

    if (child.props && child.props.name)
 {
      return React.cloneElement(child, {
        value: data[child.props.name],
        onChange: handleChange,
        error: errors[child.props.name]
      });
    }

    return child;
  });

  return (
    <form onSubmit={handleSubmit}>
      {enhancedChildren}
    </form>
  );
};

export default Form;
