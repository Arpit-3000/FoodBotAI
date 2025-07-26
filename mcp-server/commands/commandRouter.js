const leadService = require('../services/leadService');

async function commandRouter(commandObj) {
  const { command, data, id } = commandObj;

  switch (command) {
    case 'createLead':
      return await leadService.createLead(data);

    case 'getLeads':
      return await leadService.getLeads();

    case 'getLeadById':
      if (!id) throw new Error("ID is required for getLeadById");
      return await leadService.getLeadById(id);

    case 'updateLeadById':
      if (!id || !data) throw new Error("ID and data are required for updateLeadById");
      return await leadService.updateLead(id, data);

    case 'deleteLeadById':
      if (!id) throw new Error("ID is required for deleteLeadById");
      return await leadService.deleteLead(id);

    default:
      throw new Error("Unknown command");
  }
}

module.exports = commandRouter;
