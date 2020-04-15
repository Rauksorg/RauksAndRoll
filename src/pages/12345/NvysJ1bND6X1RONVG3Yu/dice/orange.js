import React from "react";

const blueDice = ['✓', '✘', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Dice() {
  const results = blueDice[randomNumber(0, 5)]
  return (
    <div>
      <div>{results}</div>
    </div>
  );
}