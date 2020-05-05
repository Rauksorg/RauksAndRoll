import React, { useReducer } from "react"
import firebase from "gatsby-plugin-firebase"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AutorenewIcon from '@material-ui/icons/Autorenew';
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
      <Typography variant="h6">Carac</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.attributes != null ? sheetField.attributes : "Loading..."}</Typography>
      <Typography variant="h4">{reroll != null ? reroll : "."} <AutorenewIcon /></Typography>
      <Typography variant="h6">Comp</Typography>
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
