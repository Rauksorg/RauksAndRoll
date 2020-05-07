import React from "react";
import { Link } from "gatsby-theme-material-ui";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, OptionIcon } from "../components/diceIcons";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default () => {
  const classes = useStyles();
  return (


    <div>
      <Link to="/12345/">
        Go to game 12345
      </Link>
      <div>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><EpicFailIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><FailIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><TwoIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><FourIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><SuccessIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><ThreeEpicIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><ExplosivIcon fontSize="large" /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><OptionIcon fontSize="large" /></Avatar>
      </div>
    </div>
  );
}
// const text = `3💪 | 3👁 | 3🧠 | 3🕶 ||| 3📖 | 3🍀`
