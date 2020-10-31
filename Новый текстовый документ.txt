const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
var Connection = require('tedious').Connection;
var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;
var config = {
  server: 'localhost',    //the IP of the machine where SQL Server runs
  authentication: {
    type: 'default',
    options: {
      userName: 'user', // update me
      password: '123456', // update me
    }
  },
  options: {
    encrypt: false,

    database: 'AbonentPlus',  //the username above should have granted permissions in order to access this DB.
  }
}

var result = [];

app.listen(5000);

var connection = new Connection(config);

connection.on('connect', function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected');
    executeStatment();
  }
})

function executeStatment() {
  var request = new Request('SELECT * FROM Executor',
    function (err) {
      if (err) {
        console.log(err);
      }
    });
  request.on("row", (columns) => {
    let row = {};
    columns.forEach(column => {
      row[column.metadata.colName] = column.value;
    })
    result.push(row);
  })
  connection.execSql(request);
};

app.get('/', function (req, res) {
  res.send(JSON.stringify(result));
});
