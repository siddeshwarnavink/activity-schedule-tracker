import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

const useStyles = makeStyles({
    card: {
        marginBottom: '12px',
    },
    textField: {
        width: '100%',
        marginTop: '10px',
        backgroundColor: '#fff'
    },
    deleteSchedule: {
        float: 'right'
    },
    moreOptions: {
        position: 'absolute'
    },
});

const TaskItem = props => {
    const classes = useStyles();

    return (
        <Card className={classes.card} key={props.listKey}>
            <CardContent>
                <TextField onChange={(e) => props.onChangeInputHandler(props.listKey, false, e.target.value)} className={classes.textField} value={props.scheduleItem.placeTime} label="Place & Time" variant="outlined" color="secondary" />
                <TextField onChange={(e) => props.onChangeInputHandler(props.listKey, true, e.target.value)} className={classes.textField} value={props.scheduleItem.activity} label="Activity" variant="outlined" color="secondary" />

                <IconButton type="button" onClick={() => props.deleteTaskHandelr(props.listKey)} className={classes.deleteSchedule} aria-controls="simple-menu" aria-haspopup="true">
                    <DeleteIcon />
                </IconButton>

                <section className={classes.moreOptions}>
                    {props.listKey !== 0 ? (
                        <IconButton type="button" onClick={() => props.moveTaskHandler(props.listKey, 1)} aria-controls="simple-menu" aria-haspopup="true">
                            <ArrowUpwardIcon />
                        </IconButton>
                    ) : null}
                    {!props.isLastItem ? (
                        <IconButton type="button" onClick={() => props.moveTaskHandler(props.listKey, -1)} aria-controls="simple-menu" aria-haspopup="true">
                            <ArrowDownwardIcon />
                        </IconButton>
                    ) : null}
                    <IconButton type="button" onClick={() => props.addNewTaskBelow(props.listKey)} aria-controls="simple-menu" aria-haspopup="true">
                        <SubdirectoryArrowRightIcon />
                    </IconButton>
                </section>
            </CardContent>
        </Card>
    );
}

export default TaskItem;