import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SentimentAatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVentIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { saveAs } from 'file-saver';

import axios from '../firebase-axios';
import { array_distinct } from '../util';
import NotificationContext from '../context/notification-context';
import AppContainer from './AppContainer';
import AppToolbar from './AppToolbar';
import AppSpinner from './AppSpinner';
import ScheduleItem from './ScheduleItem';
import IsArrayFilled from './IsArrayFilled';
import Fallback from './Fallback';
import FailedToFetchFallback from './FailedToFetchFallback';

const ViewActivity = props => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [taskList, setTaskList] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [timestamp, setTimestamp] = React.useState(null);
    const notificationCtx = React.useContext(NotificationContext);

    const pageInitialLoad = () => {
        setLoading(true);
        fetchData();
    }

    React.useEffect(pageInitialLoad, []);

    const fetchData = () => {
        axios.get(`/schedule?id=${props.match.params.id}`).then(res => res.data)
            .then(data => {
                setTaskList(data.list);
                setIsFavorite(data.isFavorite);
                setTimestamp(data.timestamp)
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const toggleFavStateHandler = () => {
        axios.patch(`/schedule?id=${props.match.params.id}`, { isFavorite: !isFavorite }).then(() => {
            notificationCtx.pushMessage(`Task ${!isFavorite ? "favorited" : "unfavorited"}`, 'success');
            fetchData();
        });
    }

    const deleteScheduleHandler = () => {
        axios.delete(`/schedule?id=${props.match.params.id}`).then(() => {
            // alert('Task deleted!');
            notificationCtx.pushMessage('Schedule Deleted', 'info');
            props.history.push('/');
        });
    }

    const downloadScheduleHandler = () => {
        let dataStr = '';

        taskList.forEach(task => {
            dataStr += `
Time & Place : ${task.placeTime}
Activity : ${task.activity}
Executed : [${task.completed ? "x" : ""}]
Reason if not executed: ${task.reason ? task.reason : "-"}
==============
            `
        })

        const blob = new Blob([`
Activity schedule for ${timestamp}

==============
        ${dataStr}
        `],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, `Activity ${timestamp}.txt`);
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const pendingTasks = () => {
        if (!taskList) return [];

        const pendingTasksList = taskList.filter(task => !task.completed);
        return array_distinct([
            ...pendingTasksList.filter(schedule => !schedule.reason),
            ...pendingTasksList.filter(schedule => (schedule.reason ? true : false)),
        ]);
    }

    const completedTasks = () => {
        if (!taskList) return [];
        return taskList.filter(task => task.completed);
    }

    const noTaskFallback = (
        <Fallback
            icon={SentimentAatisfiedAltIcon}
            label="No tasks today!"
        />
    )

    return (
        <main>
            <AppToolbar
                isGoBack
                title="View Schedule"
                actions={error === null ? (
                    <React.Fragment>
                        <IconButton
                            edge="start"
                            onClick={toggleFavStateHandler}
                            color="inherit"
                            aria-label="menu"
                            disabled={loading}
                        >
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>

                        <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            disabled={loading}
                        >
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
                            <MenuItem onClick={downloadScheduleHandler}>Download</MenuItem>
                        </Menu>
                    </React.Fragment>
                ) : null}
            />
            <AppContainer>
                {loading ? <AppSpinner /> : error === null ? taskList && taskList.length > 0 ? (
                    <React.Fragment>
                        <IsArrayFilled array={pendingTasks()}>
                            <h1 className="hollow-title">Pending tasks</h1>
                            {pendingTasks().map((task, index) => (
                                <ScheduleItem key={index} id={task.id} data={task} updateParrent={fetchData} />
                            ))}
                        </IsArrayFilled>
                        <IsArrayFilled array={completedTasks()}>
                            <h1 className="hollow-title">Completed tasks</h1>
                            {completedTasks().map((task, index) => (
                                <ScheduleItem key={index} id={task.id} data={task} updateParrent={fetchData} />
                            ))}
                        </IsArrayFilled>
                    </React.Fragment>
                ) : noTaskFallback : <FailedToFetchFallback onTryAgain={pageInitialLoad} />}
            </AppContainer>
        </main>
    );
}

export default ViewActivity;