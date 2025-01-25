import axios from 'axios';

const API_URL = 'http://localhost:8000/api/customers';
const API_URl = 'http://localhost:8000/api/customer'; 

export const getCustomers = (page, limit, sortField = "", sortOrder = "", searchTerm = "") => {
  return axios.get(`${API_URL}?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}${searchTerm ? `&search=${searchTerm}` : ""}`);
};

export const createCustomer = (customerData) => {
  return axios.post(API_URl, customerData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};



export const updateCustomer = (customerId, customerData) => {
  return axios.put(`${API_URL}/${customerId}`, customerData);
};

export const deleteCustomer = (customerId) => {
  return axios.delete(`${API_URL}/${customerId}`);
};

export const searchCustomers = (searchTerm) => {
  return axios.get(`${API_URL}?search=${searchTerm}`);
};