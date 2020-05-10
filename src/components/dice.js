import React, { useReducer } from "react";
import firebase from "gatsby-plugin-firebase"
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, SkillIcon, NeutralIcon } from "../components/diceIcons";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
  calc: {
    minHeight: 'calc(100vh - 216px)'
  }
}));

const ResultToFace = (props) => {
  const facesObject = {
    '✓': SuccessIcon,
    '2': TwoIcon,
    '3!': ThreeEpicIcon,
    '4': FourIcon,
    'S': SkillIcon,
    '✘': FailIcon,
    '✘!': EpicFailIcon,
    '💀': FailIcon,
    '☯': NeutralIcon,
    '🍀': SuccessIcon,
    '💥': ExplosivIcon,
  }
  const TagName = facesObject[props.result]
  return <TagName {...props} />
}

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
      <Typography variant="body1" className={classes.preserveLineBreak}>{sheetField.attributes != null ? sheetField.attributes : "Loading..."}</Typography>
      <Typography variant="h6">Skills</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.skills != null ? sheetField.skills : "Loading..."}</Typography>
      <Typography variant="h6" >Traits</Typography>
      <Typography variant="body2" className={classes.preserveLineBreak}>{sheetField.perks != null ? sheetField.perks : "Loading..."}</Typography>
    </div>
  );

  return (
    <div style={{ backgroundColor: diceProperties.color }}>
      <IconButton size="small" onClick={handleOpen} style={{ color: 'white' }} >
        <AccountCircleIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.calc}
      >
        <Grid item>
          <ResultToFace style={{ color: 'white', fontSize: 350, margin: 20 }} result={result} />
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"

      >
        <Grid item style={{ marginBottom: '70px' }}>
          {rerollable && <RerollButon clickFunc={rerollDice} rerollNumber={reroll} />}
        </Grid>
      </Grid>
    </div>
  );
}

export default Dice