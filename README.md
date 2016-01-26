## Athena - Stock Monitoring and Analysis System

###Node Server
How to run node server:
- cd athena/node/nodeserver
- npm install
- npm start (or supervisor bin/www)

####MongoDB
How to start mongoDB:
mongod --dbpath athena/data --smallfiles

How to interact with mongoDB:
- start: mongo
- list dbs: show dbs;
- swtich current db: use athena;
- list tables: show tables;
- list contents of a table: db.users.find().pretty()
- insert contents: db.users.insert({'username' : alice, 'email': xxx@yyy});

####Backend Python server
How to start backend server:
python athena/data_processor/backend_service/server.py


###Backend API
- Accounts
 - listAccounts(user)
 - addAccount(user, account)
- Portfolio
 - getPortfolio(self, user)
 - updatePortfolioForUser(self, user)
- Transactions
 - addTransaction(self, user, account, date, type, symbol, price, shares)
 - listAllTransactions(self, user, account)

