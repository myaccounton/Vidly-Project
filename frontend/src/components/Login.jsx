import React, { useState } from "react";
import Joi from "joi";
import auth from "../services/authService";

const Login = ({ location }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const rules = {
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    password: Joi.string().min(5).required().label("Password")
  };
  const schema = Joi.object(rules);

  const validate = () => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) validationErrors[item.path[0]] = item.message;
    return validationErrors;
  };

  const validateProperty = ({ name, value }) => {
    const rule = rules[name];
    if (!rule) return null;
    const propertySchema = Joi.object({ [name]: rule });
    const { error } = propertySchema.validate({ [name]: value });
    return error ? error.details[0].message : null;
  };

  const handleChange = ({ currentTarget: input }) => {
    const nextErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) nextErrors[input.name] = errorMessage;
    else delete nextErrors[input.name];

    setData((prev) => ({ ...prev, [input.name]: input.value }));
    setErrors(nextErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    setSubmitting(true);
    try {
      await auth.login(data.email, data.password);
      const { state } = location || {};
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setErrors({ email: ex.response.data });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-[78vh] items-center justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl shadow-black/30">
        <h1 className="mb-1 text-2xl font-bold text-white">Welcome Back</h1>
        <p className="mb-6 text-sm text-gray-400">Login to continue to your account.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && <div className="mt-1 text-xs text-red-400">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && <div className="mt-1 text-xs text-red-400">{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
