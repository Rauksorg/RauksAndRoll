import React from "react";
import DiceResult from '../../../../components/dice'

const orangeDice = ['✓', '✘', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const rollOrange = () => orangeDice[randomNumber(0, 5)]

const OrangeDice = ({location}) => <DiceResult location={location} diceFormula={rollOrange} diceProperties={{color:'orange'}}/>

export default OrangeDice