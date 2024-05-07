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
    console.log(`Server running on port ${port}`);
});

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    /* Generating the HTML using welcome template */
    response.render("index");
});
 
