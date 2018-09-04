import * as React from "react";
import { Box, BackgroundImage } from "rebass";

interface Props {
  imageUrl: string;
  width: number;
  height: number;
}

const Card = ({ imageUrl, width, height }: Props) => (
  <Box data-cy="card" width={300}>
    <BackgroundImage src={imageUrl} />
  </Box>
);

export default Card;
