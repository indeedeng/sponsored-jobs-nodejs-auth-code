const express = require('express');
const xml = require('xml');
const JobService = require('../services/JobService');

const router = express.Router();

router.get('/', async (req, res) => {
  res.contentType('application/xml');
  res.send(xml(JobService.listJobsAsXML(), true));
});

module.exports = router;
