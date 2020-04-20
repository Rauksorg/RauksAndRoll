import React from "react";
import DiceResult from '../../../../../components/dice'

const greyDice = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const bestTwoEqualTo = (arr, target) => arr.slice().sort().slice(-2).every(v => v === target)
const takeBest = arr => arr.slice().sort().slice(-1)[0] 

const takeBestCrit = (arr) => {
  if (bestTwoEqualTo(arr, 5)) return 6
  return takeBest(arr)
}

const rollDark2A = () => greyDice[takeBestCrit([randomNumber(0, 5), randomNumber(0, 5), randomNumber(0, 5)])]
const DarkDice2A = ({location}) => <DiceResult location={location} diceFormula={rollDark2A} diceProperties={{color:'dimgray'}}/>

export default DarkDice2A