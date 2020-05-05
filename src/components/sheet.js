import React, { useReducer } from "react"
import firebase from "gatsby-plugin-firebase"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles({
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
});

const Sheet = ({ sheetId }) => {
  const classes = useStyles();
  const [reroll, setReroll] = React.useState(null)

  const [sheetField, setSheetField] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      identification: null,
      attributes: null,
      skills: null,
      perks: null,
      traumas: null,
      notes: null,
    }
  );

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${sheetId}`)
      .onSnapshot(snapshot => {
        const data = snapshot.data()
        setSheetField(
          {
            identification: data.identification,
            attributes: data.attributes,
            skills: data.skills,
            perks: data.perks,
            traumas: data.traumas,
            notes: data.notes,
          })
        setReroll(data.reroll)
      });
    return unsubscribe;
  }, [sheetId])
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={9}><Typography variant="h5">{sheetField.identification != null ? sheetField.identification : "Loading..."}</Typography></Grid>
        <Grid item xs={3} ><Typography style={{textAlign:'right'}}variant="h4">{reroll != null ? reroll : "."} <AutorenewIcon /></Typography></Grid>
      </Grid>
      {/* <Typography variant="h5">{sheetField.identification != null ? sheetField.identification : "Loading..."}</Typography> */}
      {/* <Typography variant="h6">Carac.</Typography> */}
      <Typography variant="body1" className={classes.preserveLineBreak}>{sheetField.attributes != null ? sheetField.attributes : "Loading..."}</Typography>
      {/* <Typography variant="h4">{reroll != null ? reroll : "."} <AutorenewIcon /></Typography> */}
      <Typography variant="h6">Skills</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.skills != null ? sheetField.skills : "Loading..."}</Typography>
      <Typography variant="h6">Traits</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.perks != null ? sheetField.perks : "Loading..."}</Typography>
      <Typography variant="h6">Traumas</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.traumas != null ? sheetField.traumas : "Loading..."}</Typography>
      <Typography variant="h6">Notes</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.notes != null ? sheetField.notes : "Loading..."}</Typography>
    </div>
  )
}

export default Sheet
