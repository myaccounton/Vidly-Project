import React, { useState } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import Input from "./common/input";
import auth from "../services/authService";
import PasswordInput from "./common/passwordInput";


const RegisterForm = ({ history }) => {
  const [data, setData] = useState({
    username: "",
    password: "",
    name: ""
  });
  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    name: Joi.string().required().label("Name")
  };

  const handleSubmit = async () => {
    try {
      const response = await auth.register(data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      history.push("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        setErrors({ username: ex.response.data });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">Create Account</h2>
            <Form
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
              schema={schema}
              onSubmit={handleSubmit}
            >
              <Input name="name" label="Full Name" />
              <Input name="username" label="Email" type="email" />
              <PasswordInput
              name="password"
              label="Password"
              value={data.password}
              onChange={({ currentTarget }) =>
              setData({ ...data, password: currentTarget.value })
            }
            error={errors.password}
            />

              <button className="btn btn-primary w-100 mt-3">Register</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
