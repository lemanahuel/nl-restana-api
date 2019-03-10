const _ = require('lodash');
const config = require('../config/config');

module.exports = {
  isValidDomain: (req, res, next) => {
    if (_.includes(config.DOMAINS_WHITE_LIST, req.headers.origin || req.headers.host)) {
      return next();
    }
    return res.send(404, {
      error: 'err-invalid-origin-domain',
      origin: req.headers.origin || req.headers.host
    });
  }
};