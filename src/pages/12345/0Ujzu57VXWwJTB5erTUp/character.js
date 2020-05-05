import React, { useReducer, useRef } from 'react';
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
// find a way to include identification without mnessing with render
const inputsFields = [{ name: 'attributes', title: 'Carac' }, { name: 'skills', title: 'Comp' }, { name: 'perks', title: 'Traits' }, { name: 'traumas', title: 'Traumas' }, { name: 'notes', title: 'Notes' }]

const Character = ({ location }) => {
  const timer = useRef(null)

  const playerId = location.pathname.split("/")[2]
  const classes = useStyles();
  const [reroll, setReroll] = React.useState(null)

  const [userInput, setUserInput] = useReducer(
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

  const handleChange = evt => {
    clearTimeout(timer.current);
    const name = evt.target.name;
    const newValue = evt.target.value;
    setUserInput({ [name]: newValue });
    timer.current = setTimeout(() => {
      firebase
        .firestore()
        .doc(`players/${playerId}`)
        .update({
          [name]: newValue
        })
    }, 400);
  }

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot(doc => {
        const data = doc.data()
        if (!doc.metadata.hasPendingWrites) {
          inputsFields.forEach(element => {
            setUserInput({ [element.name]: doc.data()[element.name] });
          })
          setUserInput({ 'identification': doc.data().identification })
        }
        setReroll(data.reroll)
      });
    return unsubscribe;
  }, [playerId])

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
      <TextField
        name='identification'
        label='Id'
        multiline
        value={userInput.identification != null ? userInput.identification : '...'}
        onChange={handleChange}
        variant="outlined"
        className={classes.root}
        style={{ marginTop: '10px' }}
      />
      <div>
        <Typography id="discrete-slider-custom" gutterBottom style={{ marginTop: '10px' }}>
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
        {inputsFields.map((element, i) => {

          const value = userInput[element.name]
          return (
            <TextField
              key={i}
              name={element.name}
              label={element.title}
              multiline
              value={value != null ? value : "..."}
              onChange={handleChange}
              variant="outlined"
              className={classes.root}
              style={{ marginTop: '10px' }}
            />
          )
        })}
      </div>
    </form>
  );
}

export default Character