import React from 'react'
import DiceResult from '../../../../../components/dice'

const greyDice = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const allEqualTo = (arr, target) => arr.every((v) => v === target)
const takeFirst = (arr) => arr[0]

const takeFirstCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeFirst(arr)
}

const rollDark1 = () => greyDice[takeFirstCrit([randomNumber(0, 5), randomNumber(0, 5)])]

const DarkDice1 = ({ location }) => <DiceResult location={location} diceFormula={rollDark1} diceProperties={{ color: '#202020' }} rerollable={false} />

export default DarkDice1
