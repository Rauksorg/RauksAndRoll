import React from "react";
import firebase from "gatsby-plugin-firebase"
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const RerollButon = ({ clickFunc, rerollNumber }) => (
  <Fab onClick={clickFunc} >
    <AutorenewIcon />
    <div>{rerollNumber != null ? rerollNumber : "."}</div>
  </Fab>
)

export default function Dice({ diceFormula, diceProperties, location, rerollable = true }) {
  const playerId = location.pathname.split("/")[2]
  const [result, setResult] = React.useState(diceFormula())
  const [reroll, setReroll] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot(doc => {
        setReroll(doc.data().reroll)
      });

    firebase
      .firestore()
      .doc(`players/${playerId}`)
      .update({
        diceResult: result,
        dice: diceProperties.color
      });
    return unsubscribe
  }, [diceProperties, playerId, result])

  const rerollDice = () => {
    if (reroll > 0) {
      const newRerollCount = reroll - 1
      const newResult = diceFormula()
      setResult(newResult)
      setReroll(newRerollCount)
      firebase
        .firestore()
        .doc(`players/${playerId}`)
        .update({
          reroll: newRerollCount,
          diceResult: newResult,
          dice: diceProperties.color
        })
    }
  }

  return (
    <div>
      <div style={{ backgroundColor: diceProperties.color, fontSize: '200px' }}>{result}</div>
      {rerollable && <RerollButon clickFunc={rerollDice} rerollNumber={reroll} />}
    </div>
  );
}