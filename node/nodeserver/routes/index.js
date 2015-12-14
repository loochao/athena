var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  renderOverview(req, res, next);
});

router.get('/overview', function(req, res, next) {
  renderOverview(req, res, next);
});

router.get('/portfolio', function(req, res, next) {
  renderPortfolio(req, res, next);
});

router.get('/analytics', function(req, res, next) {
  renderAnalytics(req, res, next);
});

router.get('/export', function(req, res, next) {
  renderExport(req, res, next);
});

function renderOverview(req, res, next) {
  res.render('overview', { title: 'Athena' });
}

function renderPortfolio(req, res, next) {
  res.render('portfolio', { title: 'Athena' });
}

function renderAnalytics(req, res, next) {
  res.render('analytics', { title: 'Athena' });
}

function renderExport(req, res, next) {
  res.render('export', { title: 'Athena' });
}

module.exports = router;
