const config = require('../config');
const IndeedOAuthService = require('../services/IndeedOAuthService');

async function IndeedOAuthAuthorize(req, res, next) {
  const indeedOAuth = new IndeedOAuthService(config, req.session);
  const tokenSet = await indeedOAuth.getTokenSet(null);

  if (!tokenSet) {
    req.session.returnUrl = req.originalUrl;
    const authorizeURL = await indeedOAuth.getAuthorizeURL();
    res.redirect(authorizeURL);
  } else {
    res.locals.tokenSet = tokenSet;
    next();
  }
}

module.exports = IndeedOAuthAuthorize;
