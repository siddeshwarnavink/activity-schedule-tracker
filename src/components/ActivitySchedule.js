import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import TocIcon from '@material-ui/icons/Toc';
import AddIcon from '@material-ui/icons/Add';

import axios from '../firebase-axios';
import AppToolbar from './AppToolbar';
import AppContainer from './AppContainer';
import ActivityScheduleItem from './ActivityScheduleItem';
import Fab from '@material-ui/core/Fab';

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
    const [schedules, setSchedules] = React.useState(null);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios('/schedule')
            .then(res => res.data)
            .then(data => {
                // delete data['template'];

                // let transformedData = []
                // Object.keys(data).forEach(key => {
                //     transformedData.push({
                //         id: key,
                //         ...data[key]
                //     })

                // });
                setSchedules(data)
            });
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
                <h1 className="hollow-title">Favorite</h1>
                {schedules && schedules.filter(schedule => schedule.isFavorite).map((data, key) => (
                    <ActivityScheduleItem
                        key={key}
                        id={data.id}
                        timestamp={data.timestamp}
                        isFavorite={true}
                        updateParrent={fetchData}
                    />
                ))}
                <h1 className="hollow-title">Others</h1>
                {schedules && schedules.filter(schedule => !schedule.isFavorite).map((data, key) => (
                    <ActivityScheduleItem
                        key={key}
                        id={data.id}
                        timestamp={data.timestamp}
                        isFavorite={false}
                        updateParrent={fetchData}
                    />
                ))}
            </AppContainer>

            <div className={classes.fab}>
                <Fab component={Link} to="/create" color="secondary" className={classes.fabBtn} variant="extended">
                    <AddIcon />
                    Create
                </Fab>
            </div>
        </main>
    );
}

export default ActivitySchedule;