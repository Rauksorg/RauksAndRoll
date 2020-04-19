import React from "react";
import firebase from "gatsby-plugin-firebase"

const redDice = ['✓', '✘!', '✘', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Dice() {
  const [data, setData] = React.useState(redDice[randomNumber(0, 5)])
  React.useEffect(() => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        diceResult: data,
        dice: 'red'
      })
  }, [])
  return (
    <div>
      <div style={{ fontSize: '200px' }}>{data}</div>
    </div>
  );
}