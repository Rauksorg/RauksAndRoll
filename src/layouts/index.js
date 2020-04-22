import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import RoomIcon from '@material-ui/icons/Room';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DescriptionIcon from '@material-ui/icons/Description';
import Container from '@material-ui/core/Container';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import AppBar from '@material-ui/core/AppBar';
import { BottomNavigationAction } from "gatsby-theme-material-ui";

const useStyles = makeStyles({
  paper: {
    paddingBottom: 60,
  },
});

export default function Layout({ children, location }) {
  const navLocation = location.pathname.split("/")[3]
  const classes = useStyles();
  const [value, setValue] = React.useState(navLocation);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Container className={classes.paper} maxWidth="sm">
        {children}
      </Container>
      <AppBar component={'nav'} position="fixed" color="primary" style={{ top: "auto", bottom: 0 }}>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/players" label="Players" value="players" icon={<FormatListBulletedIcon />} />
          <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/inventory" label="Inventory" value="inventory" icon={<DescriptionIcon />} />
          <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/map" label="Maps" value="map" icon={<RoomIcon />} />
          <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/dice" label="Dice" value="dice" icon={<PlayArrowIcon />} />
        </BottomNavigation>
      </AppBar>
    </div>
  );
}