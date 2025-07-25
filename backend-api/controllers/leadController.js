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
    res.status(201).json({ message: 'Lead created', id, data: leadData });
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
    res.json({ message: 'Lead updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await leads.doc(req.params.id).delete();
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
