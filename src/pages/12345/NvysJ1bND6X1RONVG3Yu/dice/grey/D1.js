import React from "react";

const greyDice0 = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const allEqualTo = (arr, target) => arr.every(v => v === target)
const takeFirst = arr => arr[0]

const takeFirstCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeFirst(arr)

}
export default function GreyDice1() {
  const roll = [randomNumber(0, 5), randomNumber(0, 5)]
  const results = greyDice0[takeFirstCrit(roll)]
  return (
    <div>
      <div style={{ fontSize: '200px' }}>{results}</div>
    </div>
  );
}