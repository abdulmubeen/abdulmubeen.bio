const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server started on port 3000");
});

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

process.on("SIGINT", () => {
  server.close(() => {
    wss.clients.forEach(function each(client) {
      client.close();
    });
    shutdownDB();
  });
});

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients Connected", numClients);

  wss.broadcast(`Current Visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }
  db.run(`INSERT INTO visitors (count, time)
    VALUES(${numClients}, datetime('now'))
  `);

  ws.on("close", function close() {
    wss.broadcast(`Current Visitors: ${numClients}`);
    console.log("A Client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  console.log("Shutting Down");
  getCounts();
  db.close();
}
