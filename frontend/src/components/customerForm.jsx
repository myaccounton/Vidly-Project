import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import Input from "./common/input";
import { getCustomer, saveCustomer } from "../services/customerService";

const CustomerForm = ({ history, match }) => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    isGold: false,
  });

  const [errors, setErrors] = useState({});

  const schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    phone: Joi.string().required().label("Phone"),
    isGold: Joi.boolean(),
  };

  const customerId = match.params.id;

  useEffect(() => {
  async function fetchCustomer() {
    if (!customerId || customerId === "new") return;

    try {
      const { data: customer } = await getCustomer(customerId);
      setData(mapToViewModel(customer));
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        history.replace("/not-found");
    }
  }

  fetchCustomer();
}, [customerId, history]);



  const mapToViewModel = customer => ({
    _id: customer._id,
    name: customer.name,
    phone: customer.phone,
    isGold: customer.isGold,
  });

  const handleSubmit = async () => {
    await saveCustomer(data);
    history.push("/customers");
  };

  return (
    <div className="col-md-6">
      <h1>Customer Form</h1>

      <Form
        data={data}
        setData={setData}
        errors={errors}
        setErrors={setErrors}
        schema={schema}
        onSubmit={handleSubmit}
      >
        <Input name="name" label="Name" />
        <Input name="phone" label="Phone" />
        <button className="btn btn-primary">Save</button>
      </Form>
    </div>
  );
};

export default CustomerForm;
