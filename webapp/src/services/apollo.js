import ApolloClient from 'apollo-boost';
import { getToken } from '../helpers';
import config from '../config';

export const client = new ApolloClient({
    uri: config.graphqlUri,
    request: async operation => {
        const token = getToken();
        if (token) {
            operation.setContext({
                headers: {
                    Authorization: token,
                },
            });
        }
    },
});
