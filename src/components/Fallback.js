import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    fallback: {
        textAlign: 'center',
        marginTop: '4.5rem',
        color: '#616161',
        userSelect: 'none'
    },
    label: {
        fontSize: '2.5rem',
    },
    icon: {
        fontSize: '4.5rem'
    },
    button: {
        marginTop: '1rem',
        fontWeight: 'bold'
    }
});


const Fallback = props => {
    const classes = useStyles();

    const DisplayIcon = props.icon;

    return (
        <div className={classes.fallback}>
            <DisplayIcon className={classes.icon} />
            <Typography variant="h1" className={classes.label}>
                {props.label}
            </Typography>
            {props.buttonText ? (
                <Button
                    color="secondary"
                    className={classes.button}
                    onClick={props.buttonOnClick}
                >
                    {props.buttonText}
                </Button>
            ) : null}
        </div>
    );
}

export default Fallback;