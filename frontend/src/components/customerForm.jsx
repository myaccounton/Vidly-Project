import React, { useEffect, useCallback } from "react";
import Joi from "joi";
import useForm from "../hooks/useForm";
import useFetch from "../hooks/useFetch";
import { getCustomer, saveCustomer } from "../services/customerService";
import Input from "./common/input";
import FormSkeleton from "./common/formSkeleton";

const CustomerForm = ({ history, match }) => {
  const schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    phone: Joi.string().required().label("Phone"),
    isGold: Joi.boolean(),
  };

  const validateForm = (data) => {
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);
    if (!error) return {};

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const { data, renderInput, renderButton, handleSubmit, setData } = useForm(
    {
      name: "",
      phone: "",
      isGold: false,
    },
    validateForm
  );

  const customerId = match.params.id;

  const { data: customerData, loading } = useFetch(
    async () => {
      if (!customerId || customerId === "new") return null;
      const { data } = await getCustomer(customerId);
      return data;
    },
    [customerId]
  );

  const mapToViewModel = useCallback((customer) => ({
    _id: customer._id,
    name: customer.name,
    phone: customer.phone,
    isGold: customer.isGold,
  }), []);

  useEffect(() => {
    if (customerData) {
      setData(mapToViewModel(customerData));
    }
  }, [customerData, setData, mapToViewModel]);

  useEffect(() => {
    if (customerData === null && customerId !== "new" && !loading) {
      history.replace("/not-found");
    }
  }, [customerData, customerId, loading, history]);

  const doSubmit = async () => {
    await saveCustomer(data);
    history.push("/customers");
  };

  if (loading) return <FormSkeleton />;

  return (
    <div className="col-md-6">
      <h1>Customer Form</h1>

      <form onSubmit={handleSubmit(doSubmit)}>
        {renderInput("name", "Name")}
        {renderInput("phone", "Phone")}
        {renderButton("Save")}
      </form>
    </div>
  );
};

export default CustomerForm;
