const mysql = require("mysql2/promise");
// Queries made with mysql2 are async operations.
// Therefor we can turn this async operation into a sync operation by using the promise version of mysql2
// (These concepts were taught on the advanced JavaScript theory section.)

const pool = mysql.createPool({
  // createPool need a JS object that tells the package how to connect to a database.

  host: "localhost",
  // This holds the url of our database server.
  // Our database is also runs on our localhost:3306. So the url is localhost.
  // (We don't define the port number!)

  database: "blog",
  // "blog" is the name of the database we created on the mysql workbench.

  user: "root",
  // this is the user created automatically when we create the database.

  password: "pass mysql8",
  // this is the password of mysql root user.
});
// createPool will create a pool of connections.
// If lots of requests reach our server in the same time, this would be efficient.

module.exports = pool;
// now we can import this pool into all the files where we wanna run a query against that database.
// Ex: we can import this pool to the blog.js file now.
