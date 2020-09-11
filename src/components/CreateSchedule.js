import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

import axios from '../firebase-axios';
import { array_insert, array_move } from '../util';
import AppContainer from './AppContainer';
import AppToolbar from './AppToolbar';
import AppSpinner from './AppSpinner';
import TaskItem from './TaskItem';
import FailedToFetchFallback from './FailedToFetchFallback';
import NotificationContext from '../context/notification-context';

const useStyles = makeStyles({
    introInput: {
        marginBottom: '1rem'
    },
    addRowBtn: {
        fontWeight: 'bold',
        marginTop: '12px'
    },
    textField: {
        width: '100%',
        marginTop: '10px',
        backgroundColor: '#fff'
    },
    addToFavo: {
        float: 'right'
    }
});

const CreateActivity = props => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [scheduleList, setScheduleList] = React.useState([
        { placeTime: '', activity: '' }
    ]);
    const [templateMode, setTemplateMode] = React.useState(false);
    const [timestamp, setTimestamp] = React.useState('');
    const [shouldFav, setShouldFav] = React.useState(true);
    const notificationCtx = React.useContext(NotificationContext);

    React.useEffect(() => {
        if (props.match.params.id && props.match.params.id === 'template') {
            setTemplateMode(true);
        }
        pageInitialLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageInitialLoad = () => {
        setLoading(true);
        axios.get('/schedule-template')
            .then(res => res.data)
            .then(data => {
                if (!data) {
                    setScheduleList([{ placeTime: '', activity: '', completed: false }])
                } else {
                    setScheduleList(data.list);
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const onSaveHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        if (templateMode) {
            axios.post('/schedule-template', { list: scheduleList })
                .then(res => res.data)
                .then(() => {
                    // alert('Template successfully updated!');
                    notificationCtx.pushMessage("Template successfully updated!", 'success');
                    props.history.push('/')
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            axios.post('/schedule', {
                list: scheduleList,
                timestamp,
                isFavorite: shouldFav
            })
                .then(res => res.data)
                .then(() => {
                    // alert('Task successfully created!');
                    notificationCtx.pushMessage("Schedule successfully created!", 'success');
                    props.history.push('/');
                })
                .finally(() => {
                    setLoading(false);
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

    const addNewTaskBelow = listKey => {
        setScheduleList(oldList => {
            const blankTask = {
                placeTime: '',
                activity: '',
                completed: false,
                id: `${new Date().toISOString()}_${listKey}`
            }

            return array_insert(oldList, blankTask, listKey);
        });
    }

    const moveTaskHandler = (listKey, moveIndex) => {
        setScheduleList(oldList => {
            return array_move(oldList, listKey, listKey - moveIndex);
        });
    }

    return (
        <form onSubmit={onSaveHandler}>
            <AppToolbar
                isGoBack
                title={templateMode ? "Update Template" : "Create Schedule"}
                actions={error === null ? (
                    <React.Fragment>
                        <IconButton
                            type="submit"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            disabled={loading}
                        >
                            <DoneIcon />
                        </IconButton>
                    </React.Fragment>
                ) : null}
            />
            <AppContainer>
                {loading ? <AppSpinner /> : error === null ? (
                    <React.Fragment>
                        {!templateMode ? (
                            <div className={classes.introInput}>
                                <h1 className="hollow-title">Create tasks</h1>
                                <TextField onChange={(e) => setTimestamp(e.target.value)} value={timestamp} className={classes.textField} label="Timestamp label" variant="outlined" color="secondary" />
                            </div>
                        ) : null}
                        {scheduleList.map((scheduleItem, key) => (
                            <TaskItem
                                key={key}
                                listKey={key}
                                onChangeInputHandler={onChangeInputHandler}
                                deleteTaskHandelr={deleteTaskHandelr}
                                scheduleItem={scheduleItem}
                                addNewTaskBelow={addNewTaskBelow}
                                moveTaskHandler={moveTaskHandler}
                                isLastItem={scheduleList.length === key + 1}
                            />
                        ))}
                        <Button type="button" onClick={addNewTaskHandler} className={classes.addRowBtn} color="secondary">Add row</Button>

                        {!templateMode ? (
                            <FormGroup className={classes.addToFavo}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={shouldFav}
                                            onChange={(e) => setShouldFav(e.target.checked)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    }
                                    label="Add to favorite"

                                />
                            </FormGroup>
                        ) : null}
                    </React.Fragment>
                ) : <FailedToFetchFallback onTryAgain={pageInitialLoad} />}
            </AppContainer>
        </form>
    );
}

export default CreateActivity;