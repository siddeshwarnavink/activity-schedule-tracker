import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import axios from '../firebase-axios';
import NotificationContext from '../context/notification-context';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    card: {
        marginBottom: '12px',
    },
    cardContent: {
        display: 'flex'
    },
    data: {
        marginLeft: '5px'
    },
    data__key: {
        display: 'block',
        fontSize: '.8rem',
        marginTop: '10px',
        fontWeight: '100'
    },
    data__value: {
        display: 'block',
        fontSize: '1.2rem',
    }
});

const ScheduleItem = props => {
    const classes = useStyles();
    // const [checked, setChecked] = React.useState(props.data.completed ? true : false);
    const [reason, setReason] = React.useState(props.data.reason || '');
    const [open, setOpen] = React.useState(false);
    const notificationCtx = React.useContext(NotificationContext);

    const checked = props.data.completed ? true : false;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = () => {
        axios.patch(`/task?id=${props.id}`, { completed: !checked }).then(() => {
            props.updateParrent();
            notificationCtx.pushMessage(`Task ${!checked ? 'Completed' : 'not Completed'}`, 'success');
        })
    };

    const saveReasonHandler = () => {
        handleClose();
        axios.patch(`/task?id=${props.id}`, { reason }).then(() => {
            props.updateParrent();
            notificationCtx.pushMessage(`Reason updated' : 'not Completed'}`, 'success');
        })
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Reason if not completed"
                        color="secondary"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveReasonHandler} color="secondary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <div className={classes.data} onClick={handleClickOpen}>
                        <div>
                            <span className={classes.data__key}>Time & Place:</span>
                            <span className={classes.data__value}>{props.data.placeTime}</span>
                        </div>
                        <div>
                            <span className={classes.data__key}>Activity:</span>
                            <span className={classes.data__value}>{props.data.activity}</span>
                        </div>
                        {props.data.reason ? (
                            <div>
                                <span className={classes.data__key}>Reason if not completed:</span>
                                <span className={classes.data__value}>{reason}</span>
                            </div>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}

export default React.memo(ScheduleItem);