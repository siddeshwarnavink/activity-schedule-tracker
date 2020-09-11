import React from 'react';

const NotificationContext = React.createContext({
    messages: [],
    pushMessage: (messages, messageType) => { },
    removeMessage: key => { }
});

export default NotificationContext;