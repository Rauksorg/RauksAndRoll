import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import firebase from "gatsby-plugin-firebase";

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const marks = [
  { value: 0, label: '0', }, { value: 1, }, { value: 2, label: '2', }, { value: 3, }, { value: 4, label: '4', }, { value: 5, }, { value: 6, label: '6', }, { value: 7, }, { value: 8, label: '8', }, { value: 9, label: '9', },
];

export default function MultilineTextFields() {
  const classes = useStyles();
  const [inventory, setInventory] = React.useState(null)
  const [reroll, setReroll] = React.useState(null)

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .onSnapshot(doc => {
        const data = doc.data()
        if (!doc.metadata.hasPendingWrites) setInventory(data.inventory)
        setReroll(data.reroll)
      });
    return unsubscribe
  }, [])

  const handleInventoryChange = (event) => {
    setInventory(event.target.value)
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        inventory: event.target.value
      })
  };

  const handleRerollChange = (_, newValue) => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
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
          value={inventory ? inventory : "Loading..."}
          onChange={handleInventoryChange}
          variant="outlined"
          className={classes.root}
        />
      </div>
    </form>
  );
}