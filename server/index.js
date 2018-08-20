const express = require("express");

const HOST = process.env.IMAGE_BOARD_SERVER_HOST || "0.0.0.0";
const PORT = process.env.IMAGE_BOARD_SERVER_PORT || 8080;

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ text: "Hello world!" });
});

const server = app.listen(PORT, HOST, () => {
  const { address, port } = server.address();

  console.log(`Server listening on http://${address}:${port}/`);
});
