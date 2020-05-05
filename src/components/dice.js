import React, { useReducer } from "react";
import firebase from "gatsby-plugin-firebase"
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
}));

const RerollButon = ({ clickFunc, rerollNumber }) => (
  <Fab onClick={clickFunc} >
    <AutorenewIcon />
    <div>{rerollNumber != null ? rerollNumber : "."}</div>
  </Fab>
)

const Dice = ({ diceFormula, diceProperties, location, rerollable = true }) => {
  const classes = useStyles();
  const playerId = location.pathname.split("/")[2]
  const [result, setResult] = React.useState(diceFormula())
  const [reroll, setReroll] = React.useState(null)
  const [rerolled, setRerolled] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [sheetField, setSheetField] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      attributes: null,
      skills: null,
      perks: null,
    }
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    firebase
      .firestore()
      .doc(`players/${playerId}`)
      .update({
        diceResult: result,
        dice: diceProperties.color,
        rerolled: rerolled,
        timeRolled: Date.now(),
      });

  }, [playerId, rerolled, result, diceProperties.color])

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot(doc => {
        const data = doc.data()
        setReroll(data.reroll)
        setSheetField(
          {
            attributes: data.attributes,
            skills: data.skills,
            perks: data.perks,
          })
      });
    return unsubscribe
  }, [playerId])

  const rerollDice = () => {
    if (reroll > 0) {
      const newRerollCount = reroll - 1
      const newResult = diceFormula()
      setResult(newResult)
      setReroll(newRerollCount)
      setRerolled(true)
      firebase
        .firestore()
        .doc(`players/${playerId}`)
        .update({
          reroll: newRerollCount,
          diceResult: newResult,
          dice: diceProperties.color,
          rerolled: true,
          timeRolled: Date.now(),
        })
    }
  }

  const body = (
    <div className={classes.paper}>
      {/* <Typography variant="h6" >Carac</Typography> */}
      <Typography variant="body1" className={classes.preserveLineBreak}>{sheetField.attributes != null ? sheetField.attributes : "Loading..."}</Typography>
      <Typography variant="h6">Skills</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.skills != null ? sheetField.skills : "Loading..."}</Typography>
      <Typography variant="h6" >Traits</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.perks != null ? sheetField.perks : "Loading..."}</Typography>
    </div>
  );
  return (
    <div>
      <IconButton size="small" onClick={handleOpen}>
        <AccountCircleIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
      <div style={{ backgroundColor: diceProperties.color, fontSize: '200px' }}>{result}</div>
      {rerollable && <RerollButon clickFunc={rerollDice} rerollNumber={reroll} />}
    </div>
  );
}

export default Dice