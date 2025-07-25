const express = require('express');
const router = express.Router();
const controller = require('../controllers/leadController');

router.post('/leads', controller.createLead);
router.get('/leads', controller.getLeads);
router.get('/leads/:id', controller.getLeadById);
router.put('/leads/:id', controller.updateLead);
router.delete('/leads/:id', controller.deleteLead);

module.exports = router;
