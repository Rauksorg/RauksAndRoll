import React from "react";

const greyDice0 = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const allEqualTo = (arr, target) => arr.every(v => v === target)
const takeBest = arr => arr.sort().slice(-1)[0] 

const takeBestCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeBest(arr)
  

}
export default function GreyDice2() {
  const roll = [randomNumber(0, 5), randomNumber(0, 5)]
  const results = greyDice0[takeBestCrit(roll)]
  return (
    <div>
      <div style={{ fontSize: '200px' }}>{results}</div>
    </div>
  );
}
