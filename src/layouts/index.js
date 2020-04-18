import React from 'react';
import { Link } from "gatsby-theme-material-ui";
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
    removeBlue: { color: "#757575" }
});

const LinkButton = React.forwardRef((props, ref) => <Link {...props} ref={ref} />)

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
                <BottomNavigationAction className={classes.removeBlue} component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/players" label="Players" value="players" icon={<FormatListBulletedIcon />} />
                <BottomNavigationAction className={classes.removeBlue} component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/inventory" label="Inventory" value="inventory" icon={<DescriptionIcon />} />
                <BottomNavigationAction className={classes.removeBlue} component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/map" label="Maps" value="map" icon={<RoomIcon />} />
                <BottomNavigationAction className={classes.removeBlue} component={LinkButton} to="/12345/NvysJ1bND6X1RONVG3Yu/dice" label="Dice" value="dice" icon={<PlayArrowIcon />} />
            </BottomNavigation>
        </div>
    );
}