import app from "./app";

const HOST: string = process.env.IMAGE_BOARD_SERVER_HOST || "0.0.0.0";
const PORT: number = parseInt(process.env.IMAGE_BOARD_SERVER_PORT || "8080");

const server = app.listen(PORT, HOST, () => {
  const addressInfo = server.address();

  if (typeof addressInfo === "string") {
    console.log(`Server is listening on socket: ${addressInfo}`);

    return;
  }

  const { address, port } = addressInfo;

  console.log(`Server listening on http://${address}:${port}/`);
});
