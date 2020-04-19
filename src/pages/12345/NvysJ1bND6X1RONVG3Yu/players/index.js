import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';

// Fix listItemButton
import patchBaseButtonComponent from '../../../../../node_modules/gatsby-theme-material-ui/src/utils/patch-base-button-components'
const ListItemPatched = patchBaseButtonComponent(ListItem)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleList() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List >
        <ListItemPatched button to="/12345/NvysJ1bND6X1RONVG3Yu/players/NvysJ1bND6X1RONVG3Yu/">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Günther Olsen" />
        </ListItemPatched>
      </List>
    </div>
  );
}