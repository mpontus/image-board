const express = require("express");
const cors = require("cors");

const HOST = process.env.IMAGE_BOARD_SERVER_HOST || "0.0.0.0";
const PORT = process.env.IMAGE_BOARD_SERVER_PORT || 8080;

const app = express();

app.use(cors());

app.get("/api/posts", (req, res) => {
  res.json({
    total: 5,
    items: [
      {
        id: 1,
        imageUrl: "https://picsum.photos/1920/1080/?image=178",
        author: {
          id: 8,
          name: "Mikhail Pontus",
          avatarUrl: "https://picsum.photos/1920/1080/?image=681"
        },
        createdAt: Date.now()
      },
      {
        id: 743,
        imageUrl: "https://picsum.photos/1920/1080/?image=487",
        author: {
          id: 8,
          name: "Mikhail Pontus",
          avatarUrl: "https://picsum.photos/1920/1080/?image=328"
        },
        createdAt: Date.now()
      },
      {
        id: 27,
        imageUrl: "https://picsum.photos/1920/1080/?image=372",
        author: {
          id: 8,
          name: "Mikhail Pontus",
          avatarUrl: "https://picsum.photos/1920/1080/?image=732"
        },
        createdAt: Date.now()
      }
    ]
  });
});

const server = app.listen(PORT, HOST, () => {
  const { address, port } = server.address();

  console.log(`Server listening on http://${address}:${port}/`);
});
