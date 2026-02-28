import { useState, useCallback } from "react";
import Joi from "joi";
import auth from "../services/authService";

export const useAuthForm = (type = "login", history, location) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    ...(type === "register" && { name: "" })
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loginSchema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),

    password: Joi.string().required().label("Password")
  };

  const registerSchema = {
    ...loginSchema,
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name")
  };

  const schema = type === "register" ? registerSchema : loginSchema;

  const validate = useCallback(() => {
    const joiSchema = Joi.object(schema);
    const { error } = joiSchema.validate(data, { abortEarly: false });

    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  }, [data, schema]);

  const validateProperty = useCallback(
    ({ name, value }) => {
      const obj = { [name]: value };
      const fieldSchema = Joi.object({ [name]: schema[name] });

      const { error } = fieldSchema.validate(obj);
      return error ? error.details[0].message : null;
    },
    [schema]
  );

  const handleChange = useCallback(
    ({ currentTarget: input }) => {
      const newErrors = { ...errors };
      const errorMessage = validateProperty(input);

      if (errorMessage) newErrors[input.name] = errorMessage;
      else delete newErrors[input.name];

      setErrors(newErrors);
      setData(prev => ({ ...prev, [input.name]: input.value }));
    },
    [errors, validateProperty]
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return false;

    try {
      setLoading(true);

      if (type === "register") {
        const response = await auth.register(data);
        auth.loginWithJwt(response.headers["x-auth-token"]);
        history.push("/");
      } else {
        await auth.login(data.email, data.password);
        const { state } = location;
        window.location = state ? state.from.pathname : "/";
      }

      return true;
    } finally {
      setLoading(false);
    }
  }, [data, validate, type, history, location]);

  return {
    data,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};
