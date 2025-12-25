const { validate } = require('../../../models/customer');
const mongoose = require('mongoose');
const { Customer } = require('../../../models/customer');

describe('Customer Model & Validation', () => {

  describe('validateCustomer', () => {
    it('should return error if name is less than 5 chars', () => {
      const { error } = validate({ name: 'John', phone: '123456' });
      expect(error).not.toBeUndefined();
    });

    it('should return error if phone is less than 5 chars', () => {
      const { error } = validate({ name: 'Jonathan Doe', phone: '123' });
      expect(error).not.toBeUndefined();
    });

    it('should return error if isGold is not a boolean', () => {
      const { error } = validate({ name: 'Jonathan Doe', phone: '12345', isGold: 'yes' });
      expect(error).not.toBeUndefined();
    });

    it('should validate correctly with proper input', () => {
      const { error } = validate({ name: 'Jonathan Doe', phone: '1234567890', isGold: true });
      expect(error).toBeUndefined();
    });
  });

  
  describe('Customer Mongoose Model', () => {
    it('should set isGold to false by default', () => {
      const customer = new Customer({ name: 'Jonathan Doe', phone: '1234567890' });
      expect(customer.isGold).toBe(false);
    });

    it('should store name and phone properly', () => {
      const customer = new Customer({ name: 'Jonathan Doe', phone: '1234567890', isGold: true });
      expect(customer.name).toBe('Jonathan Doe');
      expect(customer.phone).toBe('1234567890');
      expect(customer.isGold).toBe(true);
    });
  });
});
