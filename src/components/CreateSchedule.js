import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

import axios from '../firebase-axios';
import AppContainer from './AppContainer';
import AppToolbar from './AppToolbar';

const useStyles = makeStyles({
    textField: {
        width: '100%',
        marginTop: '10px',
        backgroundColor: '#fff'
    },
    introInput: {
        marginBottom: '1rem'
    },
    deleteSchedule: {
        float: 'right'
    },
    addRowBtn: {
        fontWeight: 'bold',
        marginTop: '12px'
    },
    card: {
        marginBottom: '12px',
    },
});

const CreateActivity = props => {
    const classes = useStyles();
    const [scheduleList, setScheduleList] = React.useState([
        { placeTime: '', activity: '' }
    ]);
    const [templateMode, setTemplateMode] = React.useState(false);
    const [timestamp, setTimestamp] = React.useState('')

    React.useEffect(() => {
        if (props.match.params.id && props.match.params.id === 'template') {
            setTemplateMode(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        axios.get('/schedule-template')
            .then(res => res.data)
            .then(data => {
                if (!data) {
                    setScheduleList([{ placeTime: '', activity: '', completed: false }])
                } else {
                    setScheduleList(data.list);
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateMode]);

    const onSaveHandler = (event) => {
        event.preventDefault();
        if (templateMode) {
            axios.post('/schedule-template', { list: scheduleList })
                .then(res => res.data)
                .then(() => {
                    alert('Template successfully updated!');
                    props.history.push('/')
                });
        } else {
            axios.post('/schedule', {
                list: scheduleList,
                timestamp,
                isFavorite: false
            })
                .then(res => res.data)
                .then(() => {
                    alert('Task successfully created!');
                    props.history.push('/')
                });
        }
    }

    const addNewTaskHandler = () => {
        setScheduleList(oldList => ([
            ...oldList,
            { placeTime: '', activity: '', completed: false }
        ]));
    }

    const deleteTaskHandelr = index => {
        setScheduleList(oldList => {
            return oldList.filter((_, i) => i !== index);
        });
    }

    const onChangeInputHandler = (index, isActivity, newValue) => {
        setScheduleList(oldList => {
            const field = isActivity ? 'activity' : 'placeTime';
            return oldList.map((value, i) => {
                if (i !== index) return value;
                value[field] = newValue;
                return value;
            });
        });
    }

    return (
        <form onSubmit={onSaveHandler}>
            <AppToolbar
                isGoBack
                title={templateMode ? "Update Template" : "Create Schedule"}
                actions={(
                    <React.Fragment>
                        <IconButton type="submit" edge="start" color="inherit" aria-label="menu">
                            <DoneIcon />
                        </IconButton>
                    </React.Fragment>
                )}
            />
            <AppContainer>
                {!templateMode ? (
                    <div className={classes.introInput}>
                        <h1 className="hollow-title">Create tasks</h1>
                        <TextField onChange={(e) => setTimestamp(e.target.value)} value={timestamp} className={classes.textField} label="Timestamp label" variant="outlined" color="secondary" />
                    </div>
                ) : null}
                {scheduleList.map((scheduleItem, key) => (
                    <Card className={classes.card} key={key}>
                        <CardContent>
                            <TextField onChange={(e) => onChangeInputHandler(key, false, e.target.value)} className={classes.textField} value={scheduleItem.placeTime} label="Place & Time" variant="outlined" color="secondary" />
                            <TextField onChange={(e) => onChangeInputHandler(key, true, e.target.value)} className={classes.textField} value={scheduleItem.activity} label="Activity" variant="outlined" color="secondary" />

                            <IconButton type="button" onClick={() => deleteTaskHandelr(key)} className={classes.deleteSchedule} aria-controls="simple-menu" aria-haspopup="true">
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
                <Button type="button" onClick={addNewTaskHandler} className={classes.addRowBtn} color="secondary">Add row</Button>
            </AppContainer>
        </form>
    );
}

export default CreateActivity;