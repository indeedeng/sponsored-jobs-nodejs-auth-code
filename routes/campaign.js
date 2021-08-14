const express = require('express');
const config = require('../config');
const CampaignService = require('../services/CampaignService');
const JobService = require('../services/JobService');
const IndeedOAuthService = require('../services/IndeedOAuthService');
const IndeedOAuthAuthorize = require('../middleware/IndeedOAuthAuthorize');

const router = express.Router();

/*
 * Date Functions
 */
function getISODateString(date) {
  return date.toISOString().split('T')[0];
}

function getFutureDate(monthsInFuture) {
  const futureDate = new Date();
  futureDate.setMonth(new Date().getMonth() + monthsInFuture);
  return futureDate;
}

/*
 * Routes
 */

router.get('/no-job-source', async (req, res) => {
  const indeedOAuth = new IndeedOAuthService(config, req.session);
  const authorizeURL = await indeedOAuth.getAuthorizeURL();

  res.render('no-job-source', {
    authorizeURL,
  });
});

router.get('/create/:jobId', IndeedOAuthAuthorize, async (req, res) => {
  const jobId = Number(req.params.jobId);
  const job = JobService.getJob(jobId);
  const campaignService = new CampaignService(config, req.session, res.locals.tokenSet);

  // get account
  const account = await campaignService.getAccount();
  if (!account.jobSourceList || account.jobSourceList.length === 0) {
    res.redirect('/campaign/no-job-source');
  } else {
    // create new campaign defaults
    const newCampaign = {
      startDate: getISODateString(new Date()),
      targetEndDate: getISODateString(getFutureDate(3)),
      budgetMonthlyLimit: 100.00,
      budgetOneTimeLimit: 100.00,
    };

    res.render('campaign-create', {
      job,
      newCampaign,
    });
  }
});

router.post('/create/:jobId', IndeedOAuthAuthorize, async (req, res) => {
  const campaignService = new CampaignService(config, req.session, res.locals.tokenSet);

  // get job
  const jobId = Number(req.params.jobId);
  const job = JobService.getJob(jobId);

  // get form fields
  const newCampaign = {
    name: `${job.title} - ${new Date().toUTCString()}`,
    budgetType: req.body.selectBudgetType,
    budgetMonthlyLimit: Number(req.body.budgetMonthlyLimit),
    budgetOneTimeLimit: Number(req.body.budgetOneTimeLimit),
    startDate: getISODateString(new Date(req.body.startDate)),
    targetEndDate: getISODateString(new Date(req.body.targetEndDate)),
  };

  // get account
  const account = await campaignService.getAccount();

  // sponsor job
  campaignService.createCampaign(account, job, newCampaign);

  res.redirect('/');
});

router.get('/list', IndeedOAuthAuthorize, async (req, res) => {
  const sponsorService = new CampaignService(config, req.session, res.locals.tokenSet);
  const campaigns = await sponsorService.getCampaigns();
  res.render('campaign-list', { campaigns });
});

router.get('/campaign-details/:campaignId', IndeedOAuthAuthorize, async (req, res) => {
  const { campaignId } = req.params;

  const campaignService = new CampaignService(config, req.session, res.locals.tokenSet);
  const campaignDetails = await campaignService.getCampaignDetails(campaignId);

  res.render('campaign-details', {
    campaignDetails,
  });
});

router.post('/campaign-details/:campaignId', IndeedOAuthAuthorize, async (req, res) => {
  const { campaignId } = req.params;
  const { campaignAction } = req.body;

  const campaignService = new CampaignService(config, req.session, res.locals.tokenSet);
  await await campaignService.updateCampaignStatus(campaignId, campaignAction);

  res.redirect(`/campaign/campaign-details/${campaignId}`);
});

module.exports = router;
