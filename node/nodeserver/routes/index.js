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

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      "userlist" : docs
    });
  });
});

router.post('/adduser', function(req, res) {
  // set internal DB variable
  var db = req.db;

  // get form values. These rely on the 'name' attribtues
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  console.log("userName + userEmail");

  // set collection
  var collection = db.get('usercollection');

  // submit to the DB
  collection.insert({
    'username' : userName,
    'email' : userEmail
  }, function (err, doc) {
    if (err) {
      // if it failed, return error
      console.log(err);
      res.send("There was a problem adding the information to the database.");
    } else {
      // forward to success page
      console.log("hello!!");
      res.redirect("userlist");
    }
  });
});

router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Athena' });
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
