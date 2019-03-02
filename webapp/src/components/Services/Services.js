import React from 'react';
import { Icon, Header, Modal, Button, Loader, Segment, Card } from 'semantic-ui-react';
import ServiceDetails from './ServiceDetails';
import { Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

export const GET_USER_SERVICES = gql`
    query {
        getUserServices {
            id
            name
            description
        }
    }
`;

export const DELETE_USER_SERVICE = gql`
    mutation($id: ID!) {
        deleteUserService(id: $id)
    }
`;

export default () => {
    return (
        <ApolloConsumer>
            {client => (
                <div>
                    <Query query={GET_USER_SERVICES}>
                        {({ loading, data: { getUserServices } = {}, error }) => {
                            if (loading || getUserServices == null) return <Loader />;
                            return (
                                <div>
                                    <Header>Services</Header>
                                    <Segment>
                                        <Card.Group>
                                            {getUserServices.map(service => (
                                                <Card key={service.id}>
                                                    <Icon
                                                        name="delete"
                                                        onClick={async () => {
                                                            await client.mutate({
                                                                mutation: DELETE_USER_SERVICE,
                                                                variables: { id: service.id },
                                                                update: (
                                                                    cache,
                                                                    { data: { deleteUserService: deletedServiceId } }
                                                                ) => {
                                                                    const { getUserServices } = cache.readQuery({
                                                                        query: GET_USER_SERVICES,
                                                                    });
                                                                    cache.writeQuery({
                                                                        query: GET_USER_SERVICES,
                                                                        data: {
                                                                            getUserServices: getUserServices.filter(
                                                                                service =>
                                                                                    service.id !== deletedServiceId
                                                                            ),
                                                                        },
                                                                    });
                                                                },
                                                            });
                                                        }}
                                                    />
                                                    <Card.Header>{service.name}</Card.Header>
                                                </Card>
                                            ))}
                                        </Card.Group>
                                    </Segment>
                                </div>
                            );
                        }}
                    </Query>
                </div>
            )}
        </ApolloConsumer>
    );
};
