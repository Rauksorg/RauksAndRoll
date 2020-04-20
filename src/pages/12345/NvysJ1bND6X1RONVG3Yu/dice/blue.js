import React from "react";
import DiceResult from '../../../../components/dice'

const blueDice = ['✓', '2', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const rollBLue = () => blueDice[randomNumber(0, 5)]

const BlueDice = ({location}) => <DiceResult location={location} diceFormula={rollBLue} diceProperties={{color:'blue'}}/>

export default BlueDice