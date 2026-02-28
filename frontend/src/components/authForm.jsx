import React from 'react';
import Form from './common/form';
import Input from './common/input';
import PasswordInput from './common/passwordInput';
import FormSkeleton from './common/formSkeleton';
import { useAuthForm } from '../hooks/useAuthForm';

const AuthForm = ({ type = 'login', history, location }) => {
  const {
    data,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useAuthForm(type, history, location);

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (!success) {
      // Error is handled in the hook
    }
  };

  const title = type === 'register' ? 'Create Account' : 'Login';
  const buttonText = type === 'register' ? 'Register' : 'Login';

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">{title}</h2>
            <Form
              data={data}
              setData={() => {}} // Not needed since we use handleChange
              errors={errors}
              setErrors={() => {}} // Not needed since validation is handled in hook
              schema={{}} // Not needed since validation is handled in hook
              onSubmit={handleFormSubmit}
            >
              {type === 'register' && (
                <Input
                  name="name"
                  label="Full Name"
                  value={data.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              )}

              <Input
                name="username"
                label="Email"
                type="email"
                value={data.username}
                onChange={handleChange}
                error={errors.username}
              />

              <PasswordInput
                name="password"
                label="Password"
                value={data.password}
                onChange={handleChange}
                error={errors.password}
              />

              <button className="btn btn-primary w-100 mt-3" disabled={loading}>
                {buttonText}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;