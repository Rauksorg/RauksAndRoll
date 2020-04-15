import React from 'react';
import { navigate } from "gatsby"
import { makeStyles } from '@material-ui/core/styles';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import RoomIcon from '@material-ui/icons/Room';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DescriptionIcon from '@material-ui/icons/Description';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const useStyles = makeStyles({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
});

export default function App({ children, location }) {
    
    const classes = useStyles();
    const [value, setValue] = React.useState(location.pathname);

    const handleChange = (_, newValue) => {
        setValue(newValue);
        navigate(newValue)
    };

    return (
        <div >
            {children}
            <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom}>
                <BottomNavigationAction label="Players" value="/12345/NvysJ1bND6X1RONVG3Yu/players/" icon={<FormatListBulletedIcon />} />
                <BottomNavigationAction label="Inventory" value="/12345/NvysJ1bND6X1RONVG3Yu/inventory/" icon={<DescriptionIcon />} />
                <BottomNavigationAction label="Maps" value="/12345/NvysJ1bND6X1RONVG3Yu/map/" icon={<RoomIcon />} />
                <BottomNavigationAction label="Dice" value="/12345/NvysJ1bND6X1RONVG3Yu/dice/" icon={<PlayArrowIcon />} />
            </BottomNavigation>
        </div>
    );
}