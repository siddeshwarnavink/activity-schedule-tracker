import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'https://activity-schedule-tracker.firebaseio.com/'
// });
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/activity-schedule-server/' : '/server/'
});

export default instance;