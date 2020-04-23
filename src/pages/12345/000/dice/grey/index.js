import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import {Button} from "gatsby-theme-material-ui";
// import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';

const GreyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: grey[900],
    },
  },
}))(Button);

export default function Dice() {

  return (
    <div >
      <div>
        <GreyButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/D2A/">
          -2
        </GreyButton>
        <GreyButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/D1/">
          1
        </GreyButton>
      </div>
      <div>
        <GreyButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/D2/">
          2
        </GreyButton>
        <GreyButton disableElevation size="large" variant="contained" color="primary" to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/D3/">
          3
        </GreyButton>
      </div>
    </div>

  );
}