const express = require('express');
const JobService = require('../services/JobService');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  const jobs = JobService.listJobs();
  res.render('index', {
    jobs,
  });
});

module.exports = router;
