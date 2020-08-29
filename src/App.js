import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ActivitySchedule from './components/ActivitySchedule';
import ViewSchedules from './components/ViewSchedules';
import CreateSchedule from './components/CreateSchedule';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={ActivitySchedule}/>
      <Route exact path="/create" component={CreateSchedule}/>
      <Route exact path="/create/:id" component={CreateSchedule}/>
      <Route exact path="/view/:id" component={ViewSchedules}/>

      <Redirect to="/" />
    </Switch>
  )
}

export default App;
