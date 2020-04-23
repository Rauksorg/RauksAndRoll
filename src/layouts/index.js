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

  const classes = useStyles();
  const navLocation = location.pathname.split("/")[3]
  const playerId = location.pathname.split("/")[2]
  const [value, setValue] = React.useState(navLocation);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Container className={classes.paper} maxWidth="sm">
        {/* pass props to children */}
        {React.cloneElement(children, { test: "hello" })}
      </Container>
      <AppBar component={'div'} position="fixed" style={{ top: "auto", bottom: 0 }}>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction to={`/12345/${playerId}/players`} label="Players" value="players" icon={<FormatListBulletedIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/inventory`} label="Inventory" value="inventory" icon={<DescriptionIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/map`} label="Maps" value="map" icon={<RoomIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/dice`} label="Dice" value="dice" icon={<PlayArrowIcon />} />
        </BottomNavigation>
      </AppBar>
    </div>
  );
}