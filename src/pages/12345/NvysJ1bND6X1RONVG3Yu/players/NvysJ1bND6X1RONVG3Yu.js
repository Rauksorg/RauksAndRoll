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
    const [data2, setData2] = React.useState(null)

    React.useEffect(() => {
        firebase
            .firestore()
            .doc("players/NvysJ1bND6X1RONVG3Yu")
            .onSnapshot(snapshot => {
                setData2(snapshot.data().inventory)
            })
    }, [])

    return <div className={classes.preserveLineBreak}>{data2 ? data2: "Loading..."}</div>
}
export default Component
