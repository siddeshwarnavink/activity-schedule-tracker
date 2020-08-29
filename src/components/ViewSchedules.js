import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVentIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import axios from '../firebase-axios';
import AppContainer from './AppContainer';
import AppToolbar from './AppToolbar';
import ScheduleItem from './ScheduleItem';

const ViewActivity = props => {
    const [taskList, setTaskList] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isFavorite, setIsFavorite] = React.useState(false);

    React.useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = () => {
        axios.get(`/schedule/${props.match.params.id}.json`).then(res => res.data)
            .then(data => {
                console.log(data);
                setTaskList(data.list);
                setIsFavorite(data.isFavorite);
            })
    }

    const toggleFavStateHandler = () => {
        axios.patch(`/schedule/${props.match.params.id}.json`, { isFavorite: !isFavorite }).then(() => {
            fetchData();
        });
    }

    const deleteScheduleHandler = () => {
        axios.delete(`/schedule/${props.match.params.id}.json`).then(() => {
            alert('Task deleted!');
            props.history.push('/');
        });
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <main>
            <AppToolbar
                isGoBack
                title="View Schedule"
                actions={(
                    <React.Fragment>
                        <IconButton edge="start" onClick={toggleFavStateHandler} color="inherit" aria-label="menu">
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>

                        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
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
                        </Menu>
                    </React.Fragment>
                )}
            />
            <AppContainer>
                <h1 className="hollow-title">Pending tasks</h1>
                {taskList && taskList.filter(task => task.isFavorite).map((task, index) => (
                    <ScheduleItem key={index} index={index} id={props.match.params.id} data={task} updateParrent={fetchData} />
                ))}

                <h1 className="hollow-title">Completed tasks</h1>
                {taskList && taskList.filter(task => !task.isFavorite).map((task, index) => (
                    <ScheduleItem key={index} index={index} id={props.match.params.id} data={task} updateParrent={fetchData} />
                ))}
            </AppContainer>
        </main>
    );
}

export default ViewActivity;