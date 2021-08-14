const axios = require('axios');

class CampaignService {
  constructor(config, session, tokenSet) {
    this.config = config;
    this.session = session;
    this.tokenSet = tokenSet;
  }

  async requestResource(url, method = 'GET', data) {
    console.info(`Axios ${method}: ${url}`);
    try {
      const results = await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${this.tokenSet.access_token}`,
        },
        data,
      });
      return results.data.data;
    } catch (err) {
      console.error('Error when making request');
      console.dir(err.response.data, { depth: null });
      throw err;
    }
  }

  async getAccount() {
    const url = `${this.config.oysterBaseURL}/account`;
    return this.requestResource(url);
  }

  async getCampaigns() {
    const url = `${this.config.oysterBaseURL}/campaigns`;
    const results = await this.requestResource(url);
    // filter out deleted campaigns
    return results.Campaigns.filter((c) => c.Status !== 'DELETED');
  }

  async getCampaignDetails(campaignId) {
    // get campaign general info
    const generalUrl = `${this.config.oysterBaseURL}/campaigns/${campaignId}`;
    const general = await this.requestResource(generalUrl);

    // get campaign budget info
    const budgetUrl = `${this.config.oysterBaseURL}/campaigns/${campaignId}/budget`;
    const budget = await this.requestResource(budgetUrl);

    // get campaign properties info
    const propertiesUrl = `${this.config.oysterBaseURL}/campaigns/${campaignId}/properties`;
    const properties = await this.requestResource(propertiesUrl);

    return {
      ...general,
      ...budget,
      ...properties,
    };
  }

  async updateCampaignStatus(campaignId, newStatus) {
    const url = `${this.config.oysterBaseURL}/campaigns/${campaignId}`;
    const results = await this.requestResource(url, 'PATCH', {
      status: newStatus,
    });
    return results.Campaigns;
  }

  async createCampaign(account, job, newCampaign) {
    let request = {
      name: newCampaign.name,
      jobsSourceId: account.jobSourceList[0].id,
      jobsSourceName: account.jobSourceList[0].siteName,
      jobsToInclude: 'query',
      jobsQuery: `refnum:${job.id}`,
    };

    if (newCampaign.budgetType === 'monthly') {
      request = {
        ...request,
        ...{
          budgetMonthlyLimit: newCampaign.budgetMonthlyLimit,
          budgetFirstMonthBehavior: 'startNowProratedAmount',
        },
      };
    }
    if (newCampaign.budgetType === 'oneTime') {
      request = {
        ...request,
        ...{
          budgetOnetimeLimit: newCampaign.budgetOneTimeLimit,
          startDate: newCampaign.startDate,
          targetEndDate: newCampaign.targetEndDate,
        },
      };
    }
    const url = `${this.config.oysterBaseURL}/campaigns`;
    const results = await this.requestResource(url, 'POST', request);
    return results;
  }
}

module.exports = CampaignService;
