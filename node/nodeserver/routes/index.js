var PMASClient = require('../modules/PMASClient');

var express = require('express');
var router = express.Router();
var session = require('client-sessions');

/* GET home page. */
router.get('/', function(req, res, next) {
  renderOverview(req, res, next);
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    "title" : "Athena"
  });
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var user = "Channing";
  req.session.user = user;
  res.redirect('/overview');
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

router.get('/quotelist', function(req, res, next) {
  renderQuotelist(req, res, next);  
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      userlist : docs,
      title : "Athena"
    });
  });
});

router.get('/transactionlist', function(req, res) {
  var user = checkLoggedIn(req, res);
  var transactionlist = PMASClient.listAllTransactions(user, function(response) {
    var list = JSON.parse(response);
    res.render('transactionlist', {
      "transactionlist" : list,
      title : "Athena"
    });
  });
});

router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Athena' });
});

router.get('/newstocktransaction', function(req, res) {
  res.render('newstocktransaction', { title: 'Athena' });
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


router.post('/addstocktransaction', function(req, res) {
  var user = checkLoggedIn(req, res);

  // get form values. These rely on the 'name' attribtues
  var date = req.body.date;
  var type = req.body.type;
  var symbol = req.body.symbol;
  var price = req.body.price;
  var shares = req.body.shares;

  console.log("date: " + date + " type: " + type + " symbol: " + symbol + " price: " + price + " shares: " + shares);

  PMASClient.addTransaction("Channing", date, type, symbol, price, shares);

  res.redirect("transactionlist");
});

router.post('/updatePortfolioForUser', function(req, res) {
  var user = checkLoggedIn(req, res);
  PMASClient.updatePortfolioForUser("Channing", function(response) {
    res.redirect("portfolio");
  }); 
})

function renderOverview(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('overview', { title: 'Athena', user : user });
}

function renderPortfolio(req, res, next) {
  var user = checkLoggedIn(req, res);
  PMASClient.getPortfolio(user, function(response) {
    var portfolio;
    if (response === undefined || response === null) {
      console.log("Portfolio not found for user");
    } else {
      portfolio = JSON.parse(response);
    }
    res.render('portfolio', {
      "portfolio" : portfolio,
      title : "Athena"
    });
  });
}

function renderAnalytics(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('analytics', { title: 'Athena', user : user });
}

function renderExport(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('export', { title: 'Athena', user : user });
}

function renderQuotelist(req, res, next) {
  // TODO test only. Remove this later.
  var quoteList = [
    { symbol: "AMZN", price: 660.0, change: '2.5%', cost: 570.0 },
    { symbol: "EA", price: 54.0, change: '1.0%', cost: 47.2 },
  ];

  res.render('quotelist', {
    title: 'Athena',
    quotelist : quoteList
  });
}

function checkLoggedIn(req, res) {
  if (req.session && req.session.user) { // Check if session exist
    return req.session.user;
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
