import React, { useState } from "react";
import Joi from "joi";
import Form from "./common/form";
import Input from "./common/input";
import auth from "../services/authService";
import PasswordInput from "./common/passwordInput";


const LoginForm = ({ history, location }) => {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password")
  };

  const handleSubmit = async () => {
    try {
      await auth.login(data.username, data.password);
      const { state } = location;
      window.location = state ? state.from.pathname : "/";
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
            <h2 className="card-title mb-4">Login</h2>
            <Form
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
              schema={schema}
              onSubmit={handleSubmit}
            >
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

              <button className="btn btn-primary w-100 mt-3">Login</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
