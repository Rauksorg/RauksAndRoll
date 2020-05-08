import React from "react";
import { Link } from "gatsby-theme-material-ui";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, SkillIcon, NeutralIcon,SkillAltIcon,SuccessAltIcon } from "../components/diceIcons";

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
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><EpicFailIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><FailIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><TwoIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><ThreeEpicIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><SkillIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><FourIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><SuccessIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><SkillAltIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "blue" }}><SuccessAltIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "#202020" }}><FailIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "#202020" }}><NeutralIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "#202020" }}><SuccessIcon style={{ fontSize: 40 }} /></Avatar>
        <Avatar className={classes.large} style={{ backgroundColor: "#202020" }}><ExplosivIcon style={{ fontSize: 40 }} /></Avatar>


      </div>
    </div>
  );
}
// const text = `3💪 | 3👁 | 3🧠 | 3🕶 ||| 3📖 | 3🍀`
