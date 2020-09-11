import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import TocIcon from '@material-ui/icons/Toc';
import AddIcon from '@material-ui/icons/Add';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Fab from '@material-ui/core/Fab';

import axios from '../firebase-axios';
import IsArrayFilled from './IsArrayFilled';
import AppToolbar from './AppToolbar';
import AppContainer from './AppContainer';
import AppSpinner from './AppSpinner';
import ActivityScheduleItem from './ActivityScheduleItem';
import Fallback from './Fallback';
import FailedToFetchFallback from './FailedToFetchFallback';

const useStyles = makeStyles({
    fab: {
        position: 'fixed',
        textAlign: 'center',
        bottom: 0,
        width: '100%',
        marginBottom: '2rem'
    },
    fabBtn: {
        paddingLeft: '2rem',
        paddingRight: '2rem'
    }
});

const ActivitySchedule = () => {
    const classes = useStyles();
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [schedules, setSchedules] = React.useState(null);

    const pageInitialLoad = () => {
        setLoading(true);
        fetchData();
    }

    React.useEffect(pageInitialLoad, []);

    const fetchData = () => {
        axios('/schedule')
            .then(res => res.data)
            .then(data => {
                setSchedules(data)
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const favoriteSchedules = () => {
        if (!schedules) return [];
        return schedules.filter(schedule => schedule.isFavorite);
    }

    const otherSchedules = () => {
        if (!schedules) return [];
        return schedules.filter(schedule => !schedule.isFavorite);
    }

    return (
        <main>
            <AppToolbar
                title="Activity Schedule"
                actions={(
                    <React.Fragment>
                        <IconButton component={Link} to="/create/template" edge="start" color="inherit" aria-label="menu">
                            <TocIcon />
                        </IconButton>
                    </React.Fragment>
                )}
            />

            <AppContainer>
                {loading ? <AppSpinner /> : error === null ? schedules && schedules.length > 0 ? (
                    <React.Fragment>
                        <IsArrayFilled array={favoriteSchedules()}>
                            <h1 className="hollow-title">Favorite</h1>
                            {favoriteSchedules().map((data, key) => (
                                <ActivityScheduleItem
                                    key={key}
                                    id={data.id}
                                    timestamp={data.timestamp}
                                    isFavorite={true}
                                    updateParrent={fetchData}
                                />
                            ))}
                        </IsArrayFilled>
                        <IsArrayFilled array={otherSchedules()}>
                            <h1 className="hollow-title">Others</h1>
                            {otherSchedules().map((data, key) => (
                                <ActivityScheduleItem
                                    key={key}
                                    id={data.id}
                                    timestamp={data.timestamp}
                                    isFavorite={false}
                                    updateParrent={fetchData}
                                />
                            ))}
                        </IsArrayFilled>
                    </React.Fragment>
                ) : <Fallback icon={HourglassEmptyIcon} label="No Schedules" /> : <FailedToFetchFallback onTryAgain={pageInitialLoad} />}
            </AppContainer>

            {(error === null && !loading) ? (
                <div className={classes.fab}>
                    <Fab component={Link} to="/create" color="secondary" className={classes.fabBtn} variant="extended">
                        <AddIcon />
                    Create
                </Fab>
                </div>
            ) : null}
        </main>
    );
}

export default ActivitySchedule;