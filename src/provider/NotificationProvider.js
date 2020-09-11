import React from 'react';

import NotificationContext from '../context/notification-context';

const NotificationProvider = props => {
    const [messages, setMessages] = React.useState([]);

    return (
        <NotificationContext.Provider value={{
            messages,
            pushMessage: (message, messageType) => {
                setMessages(oldMessages => ([
                    { message, messageType, isVisible: true },
                    ...oldMessages
                ]));
            },
            removeMessage: key => {
                setMessages(oldMessages => {
                    const updatedMessages = [...oldMessages];
                    oldMessages[key].isVisible = false;
                    return updatedMessages;
                });
                setTimeout(() => {
                    setMessages(oldMessages => {
                        const updatedMessages = [...oldMessages];
                        updatedMessages.splice(key, 1)
                        return updatedMessages;
                    });
                }, 1000);
            }
        }}>
            {props.children}
        </NotificationContext.Provider>
    )
};

export default NotificationProvider;