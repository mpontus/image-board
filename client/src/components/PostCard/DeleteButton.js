import * as React from "react";
import styled from "styled-components";
import { MdDelete as DeleteIcon } from "react-icons/md";
import IconButton from "../IconButton";

const DeleteButton = ({ onClick }) => (
  <IconButton color="gray" onClick={onClick}>
    <DeleteIcon size="24" />
  </IconButton>
);

export default DeleteButton;
