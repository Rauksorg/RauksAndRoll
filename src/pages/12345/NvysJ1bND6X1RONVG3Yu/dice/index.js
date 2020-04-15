import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { withStyles } from '@material-ui/core/styles';
import { blue, orange, red, grey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';


const BlueButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[600]),
    boxShadow: 'none',
    backgroundColor: blue[600],
    '&:hover': {
      backgroundColor: blue[700],
      boxShadow: 'none',
    },
  },
}))(Button);

const OrangeButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    boxShadow: 'none',
    backgroundColor: orange[600],
    '&:hover': {
      backgroundColor: orange[700],
      boxShadow: 'none',
    },
  },
}))(Button);

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    boxShadow: 'none',
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[800],
      boxShadow: 'none',
    },
  },
}))(Button);

const GreyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[800]),
    boxShadow: 'none',
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: grey[900],
      boxShadow: 'none',
    },
  },
}))(Button);


const LinkButton = React.forwardRef((props, ref) => <Link {...props} ref={ref} />)
// index.js:2177 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?


export default function Dice() {

  return (
    <div >
      <div>
        <BlueButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/blue/">
          <CasinoOutlinedIcon />
        </BlueButton>
        <OrangeButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/orange/">
          <CasinoOutlinedIcon />
        </OrangeButton>
      </div>
      <div>
        <RedButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/red/">
          <CasinoOutlinedIcon />
        </RedButton>
        <GreyButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/">
          <CasinoOutlinedIcon />
        </GreyButton>
      </div>
    </div>

  );
}