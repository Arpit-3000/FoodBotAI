const leads = require('../models/firestore');
const { v4: uuidv4 } = require('uuid');

exports.createLead = async (req, res) => {
  try {
    const id = uuidv4();
    const leadData = {
      id,
      name: req.body.name || "Unknown",
      source: req.body.source || "Unknown",
      contact: {
        email: req.body.contact?.email || null,
        phone: req.body.contact?.phone || null
      },
      interestedProducts: req.body.interestedProducts || [],
      status: req.body.status || "New",
      notes: req.body.notes || ""
    };
    await leads.doc(id).set(leadData);
    res.status(201).json({ message: 'Lead created successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const snapshot = await leads.get();
    const result = [];
    snapshot.forEach(doc => result.push(doc.data()));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const doc = await leads.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Not found' });
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    await leads.doc(req.params.id).update(req.body);
    res.json({ message: 'Lead updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  const id = req.params.id;
  
  // Check if ID is provided
  if (!id) {
    return res.status(400).json({ 
      error: 'Lead ID is required',
      message: 'Please provide a lead ID to delete. Example: DELETE /api/leads/123',
      usage: 'DELETE /api/leads/:id'
    });
  }

  try {
    // First check if the document exists
    const doc = await leads.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ 
        error: 'Lead not found',
        message: `No lead found with ID: ${id}`
      });
    }
    
    // If it exists, delete it
    await leads.doc(id).delete();
    res.json({ 
      success: true,
      message: `Lead with ID ${id} has been deleted successfully`,
      deletedId: id
    });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ 
      error: 'Failed to delete lead',
      message: err.message 
    });
  }
};