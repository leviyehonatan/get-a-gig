import React, { useState } from 'react';
import { Form, Container } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_USER_SERVICE = gql`
    query($id: ID!) {
        getUserService(id: $id) {
            id
            name
            description
        }
    }
`;

export default ({ id, onSaved, onChange }) => {
    const [service, setService] = useState({});
    return (
        <Container fluid>
            <Query variables={{ id }} query={GET_USER_SERVICE}>
                {({ data: { getUserService } = {}, error, loading: loadingService }) => {
                    if (getUserService && id && !service.id) {
                        setService(getUserService);
                        delete getUserService.__typename;
                        if (onChange) onChange(getUserService);
                    }
                    return (
                        <Form loading={loadingService && !!id}>
                            <Form.Input
                                onChange={(e, { value }) => {
                                    setService({ ...service, name: value });
                                    if (onChange) onChange({ name: value });
                                }}
                                label="Name"
                                placeholder="Aaron's band... "
                                inline
                                autoFocus
                                fluid
                                value={service.name || ''}
                            />
                            <Form.Input
                                onChange={(e, { value }) => {
                                    setService({ ...service, description: value });
                                    if (onChange) onChange({ description: value });
                                }}
                                label="Name"
                                placeholder="Aaron's band... "
                                inline
                                fluid
                                value={service.description || ''}
                            />
                        </Form>
                    );
                }}
            </Query>
        </Container>
    );
};
