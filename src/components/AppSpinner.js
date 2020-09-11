import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
    spinner: {
        margin: 'auto',
        marginTop: '3.5rem',
        maxWidth: 100,
    }
});

const AppSpinner = () => {
    const classes = useStyles();

    return (
        <div className={classes.spinner}>
            <CircularProgress
                color="secondary"
                size="5rem"
                thickness={4.5}
            />
        </div>
    )
}

export default AppSpinner;