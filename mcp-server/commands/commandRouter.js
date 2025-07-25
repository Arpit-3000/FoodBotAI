const leadService = require('../services/leadService');

async function commandRouter(commandObj) {
  const { command, data, id } = commandObj;

  switch (command) {
    case 'createLead':
      return await leadService.createLead(data);
    case 'getLeads':
      return await leadService.getLeads();
    case 'getLeadById':
      return await leadService.getLeadById(id);
    case 'updateLead':
      return await leadService.updateLead(id, data);
    case 'deleteLead':
      return await leadService.deleteLead(id);
    default:
      throw new Error('Unsupported command');
  }
}

module.exports = commandRouter;
