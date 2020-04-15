import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
// import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';

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
        <GreyButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/-2/">
          -2
        </GreyButton>
        <GreyButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/">
          1
        </GreyButton>
      </div>
      <div>
        <GreyButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/">
          2
        </GreyButton>
        <GreyButton size="large" variant="contained" color="primary" component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice/grey/">
          3
        </GreyButton>
      </div>
    </div>

  );
}