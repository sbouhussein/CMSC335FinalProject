const http = require('http');
const fs = require("fs");
const path = require("path");
const express = require('express');
const bodyParser = require("body-parser"); /* To handle post parameters */
const { ejs } = require('ejs');
const app = express();  /* app is a request handler function */

/* Important */
process.stdin.setEncoding("utf8");

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Web server started and running at http://localhost:${port}`);

});

process.stdin.on("readable", function () {
  const dataInput = process.stdin.read();
  if (dataInput !== null) {
    const command = dataInput.trim();
    if (command === "stop") {
        process.stdout.write("Shutting down the server\n");
        process.exit(0);
    } else {
        process.stdout.write(`Invalid command: ${command}\n`);
    }
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    /* Generating the HTML using welcome template */
    response.render("index");
});

app.get("/play", (request, response) => {
  /* Generating the HTML using welcome template */
  response.render("play");
});
app.get("/guesser", (request, response) => {
  /* Generating the HTML using welcome template */
  response.render("guesser");
});
app.get("/leaderboard", (request, response) => {
  /* Generating the HTML using welcome template */
  response.render("leaderboard");
});

 
