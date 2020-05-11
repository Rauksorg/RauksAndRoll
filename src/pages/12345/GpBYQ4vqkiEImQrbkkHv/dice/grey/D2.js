import React from 'react'
import DiceResult from '../../../../../components/dice'

const greyDice = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const allEqualTo = (arr, target) => arr.every((v) => v === target)
const takeBest = (arr) => arr.slice().sort().slice(-1)[0]

const takeBestCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeBest(arr)
}

const rollDark2 = () => greyDice[takeBestCrit([randomNumber(0, 5), randomNumber(0, 5)])]

const DarkDice2 = ({ location }) => <DiceResult location={location} diceFormula={rollDark2} diceProperties={{ color: '#202020' }} rerollable={false} />

export default DarkDice2
