import React from "react"
import firebase from "gatsby-plugin-firebase"
import { makeStyles } from '@material-ui/core/styles';
import AutorenewIcon from '@material-ui/icons/Autorenew';
const useStyles = makeStyles({
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
});

function Sheet({ sheetId }) {
  // const sheetId = location.pathname.split("/")[4]
  const classes = useStyles();
  const [inventory, setInventory] = React.useState(null)
  const [reroll, setReroll] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${sheetId}`)
      .onSnapshot(snapshot => {
        const data = snapshot.data()
        setInventory(data.inventory)
        setReroll(data.reroll)
      });
    return unsubscribe;
  }, [sheetId])
  return (
    <div>
      <div style={{ fontSize: '30px' }}>{reroll != null ? reroll : "."} <AutorenewIcon /></div>
      <div className={classes.preserveLineBreak}>{inventory ? inventory : "Loading..."}</div>
    </div>
  )
}

export default Sheet
