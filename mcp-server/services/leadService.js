const axios = require('axios');
require('dotenv').config();

const BASE = process.env.BACKEND_API;

exports.createLead = async (data) => {
  const res = await axios.post(`${BASE}/api/leads`, data);
  return { status: res.status, data: res.data };
};

exports.getLeads = async () => {
  try {
    const res = await axios.get(`${BASE}/api/leads`);
    return { status: res.status, data: res.data };
  } catch (error) {
    console.error('Axios error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch leads');
  }
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
  if (!id) throw new Error('Lead ID is required for deletion');

  const res = await axios.delete(`${BASE}/api/leads/${id}`);
  
  if (res.status !== 200 && res.status !== 204) {
    throw new Error('Failed to delete lead from backend');
  }

  return { status: res.status, data: res.data || { message: 'Lead deleted' } };
};
