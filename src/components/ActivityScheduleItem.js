import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVentIcon from '@material-ui/icons/MoreVert';

import axios from '../firebase-axios';

const useStyles = makeStyles({
    card: {
        marginBottom: '12px',
    },
    action: {
        paddingTop: '3.5rem',
        float: 'right'
    },
    link: {
        textDecoration: 'none',
        color: '#000'
    }
});

const ActivityScheduleItem = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleFavStateHandler = () => {
        axios.patch(`/schedule?id=${props.id}`, { isFavorite: !props.isFavorite }).then(() => {
            alert('Favorite status updated!');
            props.updateParrent();
            handleClose();
        });
    }

    const deleteScheduleHandler = () => {
        axios.delete(`/schedule?id=${props.id}`).then(() => {
            alert('Task deleted!');
            props.updateParrent();
            handleClose();
        });
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Link className={classes.link} to={`/view/${props.id}`}>
                    <Typography variant="h5" component="h2">
                        Activity Schedule for {props.timestamp}
                    </Typography>
                </Link>

                <div className={classes.action}>
                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        <MoreVentIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={deleteScheduleHandler}>Delete</MenuItem>
                        <MenuItem onClick={toggleFavStateHandler}>{props.isFavorite ? "Remove from favorite" : "Add to favorite"}</MenuItem>
                    </Menu>
                </div>
            </CardContent>
        </Card>
    );
}

export default ActivityScheduleItem;