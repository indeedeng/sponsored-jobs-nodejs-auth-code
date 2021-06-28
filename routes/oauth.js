const express = require('express');
const config = require('../config');
const IndeedOAuthService = require('../services/IndeedOAuthService');

const router = express.Router();

router.get('/', async (req, res) => {
  const indeedOAuth = new IndeedOAuthService(config, req.session);
  try {
    // validate Auth Code
    await indeedOAuth.validateAuthorizationCode(req);

    // if everything good, redirect to returnUrl
    const { returnUrl } = req.session;
    if (returnUrl) {
      req.session.returnUrl = null;
      res.redirect(returnUrl);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error while processing OAuth callback.');
    console.dir(err, { depth: null });
    throw err;
  }
});

module.exports = router;
