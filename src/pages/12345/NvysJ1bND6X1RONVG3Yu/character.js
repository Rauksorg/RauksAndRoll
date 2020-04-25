import React from 'react';
import firebase from "gatsby-plugin-firebase";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const marks = [
  { value: 0, label: '0', }, { value: 1, }, { value: 2, label: '2', }, { value: 3, }, { value: 4, label: '4', }, { value: 5, }, { value: 6, label: '6', }, { value: 7, }, { value: 8, label: '8', }, { value: 9, label: '9', },
];

export default function MultilineTextFields({location}) {
  const playerId = location.pathname.split("/")[2]
  const classes = useStyles();
  const [inventory, setInventory] = React.useState(null)
  const [reroll, setReroll] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot(doc => {
        const data = doc.data()
        if (!doc.metadata.hasPendingWrites) setInventory(data.inventory)
        setReroll(data.reroll)
      });
    return unsubscribe;
  }, [playerId])

  const handleInventoryChange = (event) => {
    setInventory(event.target.value)
    firebase
      .firestore()
      .doc(`players/${playerId}`)
      .update({
        inventory: event.target.value
      })
  };

  const handleRerollChange = (_, newValue) => {
    firebase
      .firestore()
      .doc(`players/${playerId}`)
      .update({
        reroll: newValue
      })
  };

  return (
    <form noValidate autoComplete="off">
      <div>
        <Typography id="discrete-slider-custom" gutterBottom>
          Relances
      </Typography>
        <Slider
          value={reroll != null ? reroll : 5}
          onChange={handleRerollChange}
          aria-labelledby="discrete-slider-custom"
          step={1}
          valueLabelDisplay="auto"
          marks={marks}
          max={9}
        />
        <TextField
          id="standard-multiline-flexible"
          label="Character sheet"
          multiline
          value={inventory != null ? inventory : "Loading..."}
          onChange={handleInventoryChange}
          variant="outlined"
          className={classes.root}
        />
      </div>
    </form>
  );
}