const axios = require('axios');
require('dotenv').config();

const BASE = process.env.BACKEND_API;

exports.createLead = async (data) => {
  const res = await axios.post(`${BASE}/api/leads`, data);
  return { status: res.status, data: res.data };
};

exports.getLeads = async () => {
  const res = await axios.get(`${BASE}/api/leads`);
  return { status: res.status, data: res.data };
};

exports.getLeadById = async (id) => {
  const res = await axios.get(`${BASE}/api/leads/${id}`);
  return { status: res.status, data: res.data };
};

exports.updateLead = async (id, data) => {
  const res = await axios.put(`${BASE}/api/leads/${id}`, data);
  return { status: res.status, data: res.data };
};

exports.deleteLead = async (id) => {
  const res = await axios.delete(`${BASE}/api/leads/${id}`);
  return { status: res.status, data: res.data };
};
