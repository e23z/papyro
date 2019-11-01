import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import AdminRouter from './core/routing/router';
import AppRouter from './app/routing/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './core/utils/auth';
import { GlobalStateProvider } from './core/utils/globalState';

const WrappedApp = () => (
  <BrowserRouter>
    <GlobalStateProvider>
      <AuthProvider>
        <AdminRouter />
      </AuthProvider>
      <AppRouter />
    </GlobalStateProvider>
  </BrowserRouter>
);

ReactDOM.render(<WrappedApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
