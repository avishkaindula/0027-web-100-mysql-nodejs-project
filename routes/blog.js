const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", function (req, res) {
  res.render("posts-list");
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors");
  // This is used to create and send SQL queries to our database.
  // The result we get back when we execute this query will always be an "array" where the first is it self
  // an array with all the records that were fetched and the second item holds some metadata.
  // So we can extract the data from that array by using "array destructuring."
  // (These concept was taught on the advanced JavaScript theory section.)
  // We can pull out the "first" element of the array by using the above code.
  // The "first" element is also an "array" full of authors and their email addresses and ids.

  // this is an async operation.
  // But we need to convert it into an sync operation.
  // Therefor we can convert this into a sync operation by using the promise version of mysql2
  // and the "await" keyword.
  // (These concepts were also taught on the advanced JavaScript theory section.)

  // Therefor the below code doesn't get executed until the above code finishes executing.
  res.render("create-post", { authors: authors });
  // the first "authors" is the key that will be exposed in the create-post.ejs template.
  // the second "authors" is the destructured authors array item.
});

// async function getAuthorsResult() {
//   const [authors] = await db.query("SELECT * FROM authors");
//   console.log(authors);
//   // result ===================================================================
//   // [
//   //   { id: 1, name: 'Avishka Indula', email: 'indula@email.com' },
//   //   { id: 2, name: 'Shameen Janandith', email: 'shameen@email.com' }
//   // ]
//   // ==========================================================================
//   // This is the result that we get when we run the query.
//   // This is an array. and each element in the array is an object.
//   // So this is an "array of objects."
//   // For more information, watch this : https://www.youtube.com/watch?v=D77ANP60DaU
// }
// getAuthorsResult();

router.post("/posts", async function (req, res) {
  // req.body;
  // req.body will hold the form data of the /posts request.
  // req.body is an object with different key-value pairs.
  // keys are determined by the "name" we assign to the inputs on the form in the create-post.ejs
  // names on the create-post.ejs => title, summary, content, author_id

  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
    // title, summery, content, author are the "names" defined on create-post.ejs
  ];
  // this data array holds the data posted through the form.
  // The order in here matters as that same order passes onto the db.query()

  await db.query(
    "INSERT INTO posts (title, summery, body, author_id) VALUES (?)",
    // I've misspelled summary as "summery" inside the MYSQL workbench.
    // Therefor I also need to misspell it in here.
    [data]
  );
  // "posts" is the name of the table that we want to post the posts.
  // Inside the parenthesis, we list all the columns which we want to populate.
  // We don't want to populate id or date columns as they get populated automatically.
  // the mysql2 package will automatically take the array of values inside [data] and replace the (?) with
  // that array of values inside [data]
  // data is an array. So [data] is "an array inside an array."

  // optional===============================================================================
  // db.query(
  //   "INSERT INTO posts (title, summery, body, author_id) VALUES (?, ?, ?, ?)",
  //   [data[0], data[1], data[2], data[3]]
  // );

  res.redirect("/posts");
  // since we are in a post route, we should redirect users to another place instead of returning a template.
});
// db.query() is an async operation.
// Therefor, we need to convert it into an sync operation by using "async await."

module.exports = router;
