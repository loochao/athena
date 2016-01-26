var PMASClient = require('../modules/PMASClient');

var express = require('express');
var router = express.Router();
var session = require('client-sessions');
var passwordHash = require('password-hash');

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('overview', { title: 'Athena', user : user });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    "title" : "Athena"
  });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username : username }, function(err, users) {
    console.log(users);
    if (err) throw err;
    if (!users.length) {
      res.render('login', {
        title : "Athena",
        message : "User not found or password incorrect."
      });
    } else {
      var user = users[0];
      if (passwordHash.verify(password, user.password)) {
        req.session.user = user.username;
        res.redirect('/overview');
      } else {
        res.render('login', {
          title : "Athena",
          message : "User not found or password incorrect."
        });
      }
    }
  });
});

router.get('/overview', function(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('overview', { title: 'Athena', user : user });
});

router.get('/account', function(req, res, next) {
  var user = checkLoggedIn(req, res);
  PMASClient.listAccounts(user, function(response) {
    var accounts;
    if (response === undefined || response === null) {
      console.log("Accounts not found for user");
    } else {
      accounts = JSON.parse(response);
    }
    res.render('account', 
      {
        title: 'Athena',
        user : user,
        'accounts' : accounts,
      });
  });
});

router.post('/addAccount', function(req, res, next) {
  var user = checkLoggedIn(req, res);

  var account = req.body.account;

  console.log("user: " + user + " account: " + account);

  PMASClient.addAccount(user, account, function(response) {
    res.redirect("account");
  });
});

router.get('/portfolio', function(req, res, next) {
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
});

router.get('/analytics', function(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('analytics', { title: 'Athena', user : user });
});

router.get('/export', function(req, res, next) {
  var user = checkLoggedIn(req, res);
  res.render('export', { title: 'Athena', user : user });
});

router.get('/quotelist', function(req, res, next) {
  // TODO test only. Remove this later.
  var quoteList = [
    { symbol: "AMZN", price: 660.0, change: '2.5%', cost: 570.0 },
    { symbol: "EA", price: 54.0, change: '1.0%', cost: 47.2 },
  ];

  res.render('quotelist', {
    title: 'Athena',
    quotelist : quoteList
  });
});

router.get('/transactionlist', function(req, res) {
  var user = checkLoggedIn(req, res);
  PMASClient.listAllTransactions(user, function(response) {
    var list = JSON.parse(response);
    res.render('transactionlist', {
      "transactionlist" : list,
      title : "Athena"
    });
  });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Athena' });
});

router.get('/newstocktransaction', function(req, res) {
  var user = checkLoggedIn(req, res);
  PMASClient.listAccounts(user, function(response) {
    var accounts_list = JSON.parse(response);
    var accounts = []
    for (var i = 0; i < accounts_list.length; i++) {
      accounts.push(accounts_list[i]['account'])
    }
    res.render('newstocktransaction', {
      title: 'Athena',
      'accounts' : accounts
    });
  });
});

router.post('/register', function(req, res) {
  // get form values. These rely on the 'name' attribtues
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = passwordHash.generate(password);

  // check if the username is already picked
  User.find({ username : username }, function(err, users) {
    if (err) throw err;
    if (users) {
      console.log("User found for: " + username);
      res.render('register', {
        title: 'Athena',
        message: 'Username is already picked. Please pick a new one.'
      });
    } else {
        var newUser = User({
          username : username,
          email : email,
          password : hashedPassword,
        });
        // save the user
        newUser.save(function(err) {
          if (err) throw err;
          console.log('User created!');
          req.session.user = username;
          res.redirect('overview');
        });
    }
  });

});

router.post('/addstocktransaction', function(req, res) {
  var user = checkLoggedIn(req, res);

  // get form values. These rely on the 'name' attribtues
  var account = req.body.account;
  var date = req.body.date;
  var type = req.body.type;
  var symbol = req.body.symbol;
  var price = req.body.price;
  var shares = req.body.shares;

  console.log("account: " + account, "date: " + date + " type: " + type + " symbol: " + symbol + " price: " + price + " shares: " + shares);

  PMASClient.addTransaction(user, account, date, type, symbol, price, shares, function(response) {
    res.redirect("transactionlist");
  });
});

router.post('/updatePortfolioForUser', function(req, res) {
  var user = checkLoggedIn(req, res);
  PMASClient.updatePortfolioForUser(user, function(response) {
    res.redirect("portfolio");
  }); 
});

function checkLoggedIn(req, res) {
  if (req.session && req.session.user) { // Check if session exist
    return req.session.user;
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
