import React from "react";
import firebase from "gatsby-plugin-firebase"
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const blueDice = ['✓', '2', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const rollBLue = () => blueDice[randomNumber(0, 5)]

export default function Dice() {
  const [result, setResult] = React.useState(rollBLue())
  const [reroll, setReroll] = React.useState(null)

  React.useEffect(() => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .onSnapshot(doc => {
        setReroll(doc.data().reroll)
      });

    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        diceResult: result,
        dice: 'blue'
      })
  }, [])

  const rerollDice = () => {
    if (reroll > 0) {
      const newRerollCount = reroll - 1
      const newResult = rollBLue()
      setResult(newResult)
      setReroll(newRerollCount)
      firebase
        .firestore()
        .doc("players/NvysJ1bND6X1RONVG3Yu")
        .update({
          reroll: newRerollCount,
          diceResult: newResult,
          dice: 'blue'
        })

    }
  }

  return (
    <div>
      <div style={{ fontSize: '200px' }}>{result}</div>
      <Fab onClick={rerollDice} >
        <AutorenewIcon />
        <div>{reroll != null ? reroll : "."}</div>
      </Fab>
    </div>
  );
}