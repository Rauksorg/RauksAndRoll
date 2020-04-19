import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import firebase from "gatsby-plugin-firebase";

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%'
  },
});

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
];

export default function MultilineTextFields() {
  const classes = useStyles();
  const [data, setData] = React.useState({ inventory: null, reroll: null })

  React.useEffect(() => {
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .onSnapshot(doc => {
        const data = doc.data()
        // check if changes are local
        if (!doc.metadata.hasPendingWrites) setData({ inventory: data.inventory, reroll: data.reroll })

      });
  }, [])

  const handleChange = (event) => {
    setData({ ...data, inventory: event.target.value });
    firebase
      .firestore()
      .doc("players/NvysJ1bND6X1RONVG3Yu")
      .update({
        inventory: event.target.value
      })
  };

  const handleChange2 = (_, newValue) => {
    setData({ ...data, reroll: newValue });
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
          value={data.reroll!=null ? data.reroll : 5}
          onChange={handleChange2}
          aria-labelledby="discrete-slider-custom"
          step={1}
          valueLabelDisplay="auto"
          marks={marks}
          max={9}
        />

        <TextField
          id="standard-multiline-flexible"
          label="Multiline"
          multiline
          value={data.inventory ? data.inventory : "Loading..."}
          onChange={handleChange}
          variant="outlined"
          className={classes.root}

        />
      </div>
    </form>
  );
}