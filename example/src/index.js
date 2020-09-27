import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { RequestProvider } from './Request';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
    <RequestProvider>
        <SnackbarProvider maxSnack={10}>
            <App />
        </SnackbarProvider>
    </RequestProvider>,
    document.getElementById('root')
);
