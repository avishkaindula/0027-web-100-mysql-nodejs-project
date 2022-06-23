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

module.exports = router;
