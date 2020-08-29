import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://activity-schedule-tracker.firebaseio.com/'
});

export default instance;