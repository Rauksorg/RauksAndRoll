import React from "react";
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const blueDice = ['✓', '2', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Dice() {
  const results = blueDice[randomNumber(0, 5)]
  return (
    <div>
      <div>{results}</div>
      <Fab>
        <AutorenewIcon />
        <div>8</div>
      </Fab>
    </div>
  );
}