import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: '1rem',
    },
}));

const AppContainer = props => {
    const classes = useStyles();
    
    return (
        <Container className={classes.container}>
            {props.children}
        </Container>
    )
}

export default AppContainer;