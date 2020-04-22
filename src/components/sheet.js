import React from "react"
import firebase from "gatsby-plugin-firebase"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
});

function Sheet({ location }) {
  const sheetId = location.pathname.split("/")[4]
  const classes = useStyles();
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${sheetId}`)
      .onSnapshot(snapshot => {
        setData(snapshot.data().inventory)
      });
    return unsubscribe;
  }, [sheetId])
  return <div className={classes.preserveLineBreak}>{data ? data : "Loading..."}</div>
}
export default Sheet
