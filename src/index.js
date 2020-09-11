import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

import './index.css';
import App from './App';
import NotificationProvider from './provider/NotificationProvider';
import axios from './firebase-axios';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow[700],
    },
    secondary: {
      main: '#6202EE',
    },
  },
});

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);

axios.get('/client-version')
  .then(res => res.data)
  .then(({ version }) => {

    if (!localStorage.getItem('pwa-version')) {
      localStorage.setItem('pwa-version', version)
      serviceWorker.register();
    }

    if (localStorage.getItem('pwa-version') !== version) {
      serviceWorker.unregister();
      serviceWorker.register();
    }
  });