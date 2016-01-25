Athena

Stock monitoring system

How to run:
- cd athena/node/nodeserver
- npm install
- npm start (or supervisor bin/www)

How to start mongoDB:
mongod --dbpath athena/data --smallfiles

How to interact with mongoDB:
- start: mongo
- list dbs: show dbs;
- swtich current db: use athena;
- list tables: show tables;
- list contents of a table: db.users.find().pretty()

How to start backend server:
python athena/data_processor/backend_service/server.py


Backend API
- addTransaction(self, user, account, date, type, symbol, price, shares)
- listAllTransactions(self, user, account)
- getPortfolio(self, user)
- updatePortfolioForUser(self, user)
