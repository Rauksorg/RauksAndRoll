import React from "react";
import DiceResult from '../../../../components/dice'

const redDice = ['✓', '✘!', '✘', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const rollRed = () => redDice[randomNumber(0, 5)]

const RedDice = ({location}) => <DiceResult location={location} diceFormula={rollRed} diceProperties={{color:'red'}}/>

export default RedDice