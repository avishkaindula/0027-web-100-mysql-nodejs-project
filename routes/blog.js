const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
  `;
  // This is how we query all the posts from the post table and display them in here.
  // But the author details are stored in a different table.
  // Therefor, we need to connect the authors table to the posts table by using author_id
  // We can improve the readability of our code by using back ticks and split our sql query into two lines like
  // this and store it in a constant.

  const [posts] = await db.query(query);
  // array destructuring is used in here.

  res.render("posts-list", { posts: posts });
  // The first "posts" is the key that will be available in the post-list.ejs template.
  // The second "posts" is the constant we created as [posts]
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
    // title, summary, content, author are the "names" defined on create-post.ejs
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

router.get("/posts/:id", async function (req, res) {
  // :id will create dynamic urls for different posts. (we can also use any identifier name instead of "id")
  const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
  `;
  // id defined on the above query is the id on the posts table

  const [posts] = await db.query(query, [req.params.id]);
  // [req.params.id] => this is how we extract the id from the request sent by clicking the "View Post" button on
  // the post-item.ejs file.
  // now the ? on the query will be replaced by this [req.params.id]
  // mysql2 package will return an "array of posts", but that array holds only one item matching to that id.

  // We need to handle the situation where the users manually enter an id of the post in the URL that doesn't exist.
  if (!posts || posts.length === 0) {
    // !posts will handle the situations where the posts is undefined.
    // posts.length === 0 means we didn't find any posts. (posts.length will give us how many items are there in posts.)
    return res.status(404).render("404");
    // We can add a return keyword like this so that the code thereafter won't be executed.
  }

  const postData = {
    ...posts[0],
    // ... is a spread operator.
    // It will get all the data off the single post into that object.
    // spread operator ensures that we take all the key value pairs that are part
    // of this single post object and all those key value pairs are spread out into this object..
    // Now we can enrich this object with more data.
    // we can now format the date property inside that posts array like this.
    date: posts[0].date.toISOString(),
    // By default DATETIME value inside a database is converted into a JS date object by Mysql2
    // Therefor we can call date object methods on it like toISOString().
    // It will convert the date into a standard machine readable string representation.
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      // We can refer MDN Docs to find out which values support which keys.
      // toLocaleDateString() will transform the date into a string that is human readable.
    }),
  };
  // This object will hold all the data

  // res.render("post-detail", { post: posts[0] });
  // });
  // posts[0] => this is how we extract the first and only item of the posts array.
  // post: is the key which will be exposed to the post-detail.ejs template.

  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit", async function (req, res) {
  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }
  // First of all we need to populate the update-post.ejs with already entered data
  // Therefor first we need to select the data from the data using the above query.

  res.render("update-post", { post: posts[0] });
  // This post key will expose the post's data to update-post.ejs
});

router.post("/posts/:id/edit", async function (req, res) {
  const query = `
    UPDATE posts SET title = ?, summery = ?, body = ?
    WHERE id = ?
  `;

  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
  // We need to provide the values inside the [] in the same order as the title, summery, body and id.
  // body, summary, content are the names we provided on the form on the update-post.ejs

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  await db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
  // Since this is a short query, we can write it like this and assign the id to it.
  res.redirect("/posts");
  // after deleting the post, we need to redirect to /posts like this.
});

module.exports = router;
