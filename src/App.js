import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

import NotificationContext from './context/notification-context';
import Alert from './components/Alert';
import ActivitySchedule from './components/ActivitySchedule';
import ViewSchedules from './components/ViewSchedules';
import CreateSchedule from './components/CreateSchedule';

const App = () => {
  const notificationCtx = React.useContext(NotificationContext);

  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={ActivitySchedule} />
        <Route exact path="/create" component={CreateSchedule} />
        <Route exact path="/create/:id" component={CreateSchedule} />
        <Route exact path="/view/:id" component={ViewSchedules} />

        <Redirect to="/" />
      </Switch>

      {notificationCtx.messages.map((message, index) => {
        const onClose = () => {
          notificationCtx.removeMessage(index);
        }

        return (
          <Snackbar key={index} open={message.isVisible} autoHideDuration={2000} onClose={onClose}>
            <Alert onClose={onClose} severity={message.messageType || "info"}>
              {message.message}
            </Alert>
          </Snackbar>
        );
      })}
    </React.Fragment>
  )
}

export default App;
