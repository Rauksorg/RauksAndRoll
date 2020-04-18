import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import RoomIcon from '@material-ui/icons/Room';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DescriptionIcon from '@material-ui/icons/Description';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import {BottomNavigationAction} from "gatsby-theme-material-ui";

const useStyles = makeStyles({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
    removeBlue: { color: "#757575" }
});

export default function Layout({ children, location }) {
    
    const classes = useStyles();
    const [value, setValue] = React.useState(location.pathname.split("/")[3]);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <div >
            {children}
            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/players" label="Players" value="players" icon={<FormatListBulletedIcon />} />
                <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/inventory" label="Inventory" value="inventory" icon={<DescriptionIcon />} />
                <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/map" label="Maps" value="map" icon={<RoomIcon />} />
                <BottomNavigationAction to="/12345/NvysJ1bND6X1RONVG3Yu/dice" label="Dice" value="dice" icon={<PlayArrowIcon />} />
            </BottomNavigation>
        </div>
    );
}