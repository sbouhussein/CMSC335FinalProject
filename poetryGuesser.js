const http = require('http');
const fs = require("fs");
const path = require("path");
const express = require('express');
const bodyParser = require("body-parser"); /* To handle post parameters */
const { ejs } = require('ejs');
const app = express();  /* app is a request handler function */

require("dotenv").config({ path: path.resolve(__dirname, '.env') })
const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = {db: "Poetry_DB", collection:"users"};
const { MongoClient, ServerApiVersion } = require('mongodb');

/* Important */
process.stdin.setEncoding("utf8");

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Web server started and running at http://localhost:${port}`);

});

app.use(express.static('static'));

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
  response.render("guesser");
});

app.post("/submit/:score", (request, response) => {
  /* Generating the HTML using welcome template */
  const variables = { score: request.params.score}
  response.render("submitScore", variables);
});

app.post("/submit", (request, response) => {
  let {name, poet, score} = request.body;
  let variables = {
    name : name,
    poet : poet,
    score : score
  }

  async function useInsert() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        try {
            await client.connect();
            const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(variables);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
  }

  useInsert();
  response.render("postSubmit")
});

app.get("/guesser", (request, response) => {
  /* Generating the HTML using welcome template */
  response.render("guesser");
});
app.get("/leaderboard", (request, response) => {
  /* Generating the HTML using welcome template */
  
  async function getLeaderboard(){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
      await client.connect();
      let res = await lookUpScores(client, databaseAndCollection);

      function compareByScore(a, b) {
        if (a.score < b.score) {
          return 1;
        }
        if (a.score > b.score) {
          return -1;
        }
        return 0;
      }
      res.sort(compareByScore)

      tableStr = "<table>\n<tr><th>Name</th><th>Favorite Poet</th><th>Score</th></tr>";
      for (let i of res) {
        tableStr += `<tr><td>${i.name}</td><td>${i.poet}</td><td>${i.score}</td></tr>`
      }
      tableStr += "</table>"
      const variables = {
        tableHTML : tableStr
      }
      response.render("leaderboard", variables)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  }
  
  getLeaderboard();
});

async function lookUpScores(client, databaseAndCollection) {
  let filter = {}
  const cursor = client.db(databaseAndCollection.db)
  .collection(databaseAndCollection.collection)
  .find(filter);

  const result = await cursor.toArray();
  return result;
}



