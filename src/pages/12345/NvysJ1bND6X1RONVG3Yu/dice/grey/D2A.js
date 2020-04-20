import React from "react";
import DiceResult from '../../../../../components/dice'

const greyDice = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const allEqualTo = (arr, target) => arr.every(v => v === target)
const takeWorst = arr => arr.sort()[0]

const takeWorstCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeWorst(arr)
}

const rollDark2A = () =>greyDice[takeWorstCrit([randomNumber(0, 5), randomNumber(0, 5)])]
const DarkDice2A = ({location}) => <DiceResult location={location} diceFormula={rollDark2A} diceProperties={{color:'dimgray'}}/>

export default DarkDice2A