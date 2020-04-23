import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { blue, orange, red, grey } from '@material-ui/core/colors';
import {Button} from "gatsby-theme-material-ui";
import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';


const BlueButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const OrangeButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: orange[600],
    '&:hover': {
      backgroundColor: orange[700],
    },
  },
}))(Button);

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
}))(Button);

const GreyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: grey[900],
    },
  },
}))(Button);

export default () => {

  return (
    <div >
      <div>
        <BlueButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/blue/">
          <CasinoOutlinedIcon />
        </BlueButton>
        <OrangeButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/orange/">
          <CasinoOutlinedIcon />
        </OrangeButton>
      </div>
      <div>
        <RedButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/red/">
          <CasinoOutlinedIcon />
        </RedButton>
        <GreyButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/">
          <CasinoOutlinedIcon />
        </GreyButton>
      </div>
    </div>

  );
}