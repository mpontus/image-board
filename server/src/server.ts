import app, { logger } from "./app";

const HOST: string = process.env.IMAGE_BOARD_SERVER_HOST || "0.0.0.0";
const PORT: number = parseInt(
  process.env.IMAGE_BOARD_SERVER_PORT || "8080",
  10
);

const server = app.listen(PORT, HOST, () => {
  const addressInfo = server.address();

  if (typeof addressInfo === "string") {
    logger.info(`Server is listening on socket: ${addressInfo}`);

    return;
  }

  const { address, port } = addressInfo;

  logger.info(`Server listening on http://${address}:${port}/`);
});
