import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  removeBlue: { color: "#757575" },
}));


const LinkButton = React.forwardRef((props, ref) => <Link {...props} ref={ref} />)
// index.js:2177 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

export default function SimpleList() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List >
        <ListItem className={classes.removeBlue} button component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/players/NvysJ1bND6X1RONVG3Yu/">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Günther Olsen" />
        </ListItem>
      </List>
    </div>
  );
}