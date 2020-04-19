import React from "react";
import firebase from "gatsby-plugin-firebase"

const greyDice0 = ['💀', '💀', '☯', '☯', '🍀', '🍀', '💥']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const allEqualTo = (arr, target) => arr.every(v => v === target)
const takeWorst = arr => arr.sort()[0]

const takeWorstCrit = (arr) => {
  if (allEqualTo(arr, 5)) return 6
  return takeWorst(arr)

}
export default function GreyDiceMinus2() {
  const roll = [randomNumber(0, 5), randomNumber(0, 5)]
  const results = greyDice0[takeWorstCrit(roll)]
  const [data, setData] = React.useState(results)

  React.useEffect(() => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        diceResult: data,
        dice: 'black'
      })
  }, [])

  return (
    <div>
      <div style={{ fontSize: '200px' }}>{data}</div>
    </div>
  );
}