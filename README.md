# expense-tracker
A simple web application to start the first step of financial freedom

## Features
- read all record
- create new record
- edit record
- delete record
- checkout total amount of all or chosen categories
- filter records by category
- search records by name
- sort records by date or amount
- show record in a month

## Environment SetUp
1. [Node.js](https://nodejs.org/en/) 10.22.0
2. [Express](https://expressjs.com/en/starter/installing.html) 4.17.1
3. [nodemon](https://nodemon.io/) 2.0.4
4. [MongoDB](https://www.mongodb.com/try/download/community) 4.2.9

## Installation and Execution
### Setup MongoDB
1. Turn on the DB
```
[~] $ cd ~/mongodb/bin/
[~/mongodb/bin] $ ./mongod --dbpath ~/mongodb-data
```
2. Create a database named "expense-tracker"
```
add expense-tracker
```

### Activate Project
1. Clone this git to local
```
[~] $ git clone https://github.com/klkuocx/expense-tracker.git
```

2. Get into the directory
```
[~] $ cd expense-tracker
```

3. Install packages
```
[~/expense-tracker] $ npm install
```

4. Run the project
```
[~/expense-tracker] $ npm run seed
[~/expense-tracker] $ npm run start
```