// // var fs = require('fs');
// // var csv = require('fast-csv');
// // var sqlite3 = require('sqlite3').verbose();
// // var db = new sqlite3.Database('libraryDb');

// // var string = [];

// // db.serialize(function() {
// //     db.run("CREATE TABLE IF NOT EXISTS user (author TEXT, book TEXT, category TEXT, borrowBook INT)");
  
//     // fs.createReadStream('datasample.csv')
//     //   .pipe(csv())
//     //   .on('data',function(data){
//     //       string = data;
          
//     //       var stmt = db.prepare("INSERT INTO user VALUES (?,?,?,?)");
//     //       stmt.run(string[3], string[4], string[6], 0);  
//     //       stmt.finalize();
  
//     //       console.log(data);
//     //   })
//     //   .on('end',function(data){
//     //       console.log('Read Finished')
//     //       console.log(string[3]);
//     //   })
// //   });

// //   db.each("SELECT author, book, category, borrowBook FROM user", function(err, row) {
// // 	console.log("Author: "+ row.author);
// // });

// // fs.createReadStream('datasample.csv')
// //     .pipe(csv())
// //     .on('data',function(data){
// //         string = data;
// //         console.log(data);
// //     })
// //     .on('end',function(data){
// //         console.log('Read Finished')
// //         console.log(string[3]);
// //     })

// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "chabot",
//     password: "12345"
//   });
  
//   con.connect(function(err) {

//     console.log("Connected!");

//     con.query("CREATE DATABASE mydb", function (err, result) {
        
//         console.log("Database created");
//       });
//     var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
//     con.query(sql, function (err, result) {
//     console.log("Table created");
//     });
//     var sql = "INSERT INTO customers (name, address) VALUES ?";
//     var values = [
//       ['John', 'Highway 71'],
//       ['Peter', 'Lowstreet 4'],
//       ['Amy', 'Apple st 652'],
//       ['Hannah', 'Mountain 21'],
//       ['Michael', 'Valley 345'],
//       ['Sandy', 'Ocean blvd 2'],
//       ['Betty', 'Green Grass 1'],
//       ['Richard', 'Sky st 331'],
//       ['Susan', 'One way 98'],
//       ['Vicky', 'Yellow Garden 2'],
//       ['Ben', 'Park Lane 38'],
//       ['William', 'Central st 954'],
//       ['Chuck', 'Main Road 989'],
//       ['Viola', 'Sideway 1633']
//     ];
//     con.query(sql, [values], function (err, result) {
//     //   console.log("Number of records inserted: " + result.affectedRows);
//       console.log(result);
//     });
//     con.query("SELECT * FROM customers", function (err, result, fields) {
//         console.log(result);
//       });
//   });

import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import 'babel-polyfill';


export function createFulfillmentMessages(res,title, author, category, url,intent){
  var fulfillmentMessagesList = [];
  fulfillmentMessagesList.push(creatCard(res,title, author, category, url));
  fulfillmentMessagesList.push(createQuickReplies(res,title, author, category,intent));
return fulfillmentMessagesList;
}

export function creatCard(res, title, author, category, url) {

  return {

  "card": {
  "title": title,
  "subtitle": author,
  "imageUri": url,
  "buttons": [
  {
  //"text": "borrow " + title
  }
]
},
  "platform": "FACEBOOK"
};
}

export function createQuickReplies(res,title, author, category, intent){
    var action;
    var reply;
    switch(intent){
    case 'searchBook':
      action = ["borrow "+title,"return "+title];
      reply = "You've searched " + title;
    break;
    case 'borrowBook':
      action = ["borrow "+title,"return "+title];
      reply = "You've borrowed " + title;
    break;
    case 'returnBook':
      action = ["borrow "+title,"return "+title, "search "+title, "show borrowed books"];
      reply = "You've returned " + title;
    }
      return {
        "quickReplies": {
        "title": reply,
        "quickReplies": action
      },
        "platform": "FACEBOOK"
    };
}