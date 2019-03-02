import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
// import { HttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import * as serviceWorker from './serviceWorker';
import store from './redux/store';
import App from './components/App';
import { client } from './services';

ReactDOM.render(
    <ReduxProvider store={store}>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </ReduxProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
