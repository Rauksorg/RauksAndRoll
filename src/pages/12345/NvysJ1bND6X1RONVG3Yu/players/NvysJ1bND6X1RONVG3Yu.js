import React from "react"
import firebase from "gatsby-plugin-firebase"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
});

function Component() {
  const classes = useStyles();
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .onSnapshot(snapshot => {
        setData(snapshot.data().inventory)
      });
    return unsubscribe;
  }, [])
  return <div className={classes.preserveLineBreak}>{data ? data : "Loading..."}</div>
}
export default Component
