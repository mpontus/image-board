import * as React from "react";
import { BackgroundImage, Box } from "rebass";

interface Props {
  imageUrl: string;
  width: number;
  height: number;
}

const Card = ({ imageUrl, width, height }: Props) => (
  <Box data-cy="card">
    <BackgroundImage src={imageUrl} ratio={height / width} />
  </Box>
);

export default Card;
