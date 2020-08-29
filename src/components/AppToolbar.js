import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    actions: {
        marginLeft: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    },
}));

const AppToolbar = props => {
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                {props.isGoBack ? (
                    <IconButton component={Link} to="/" edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <ArrowBack />
                    </IconButton>
                ) : null}
                <Typography variant="h6" className={classes.title}>
                    {props.title}
                </Typography>
                <Typography className={classes.actions}>
                    {props.actions}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default AppToolbar;