import React from "react";
import firebase from "gatsby-plugin-firebase"
// import Fab from '@material-ui/core/Fab';
// import AutorenewIcon from '@material-ui/icons/Autorenew';

const blueDice = ['✓', '2', '3!', '4', 'S', '✘!']

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Dice() {
  const [data, setData] = React.useState(blueDice[randomNumber(0, 5)])

  React.useEffect(() => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        diceResult: data,
        dice: 'blue'
      })
  }, [])

  return (
    <div>
      <div style={{ fontSize: '200px' }}>{data}</div>
      {/* <Fab>
        <AutorenewIcon />
        <div>8</div>
      </Fab> */}
    </div>
  );
}