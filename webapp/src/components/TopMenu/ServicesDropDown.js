import React, { useState } from 'react';
import { Dropdown, Modal, Container, Icon, Button } from 'semantic-ui-react';
import { Mutation, Query } from 'react-apollo';
import { GET_USER_SERVICES } from '../Services/Services';
import ServiceDetails from '../Services/ServiceDetails';
import gql from 'graphql-tag';

const SAVE_SERVICE_MUTATION = gql`
    mutation($service: ServiceInput!) {
        saveService(service: $service) {
            id
            name
        }
    }
`;

export default () => {
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [service, setService] = useState({});
    return (
        <Dropdown item simple text="Services">
            <Dropdown.Menu>
                <Query query={GET_USER_SERVICES}>
                    {({ data: { getUserServices } = {}, error, loading }) => {
                        if (!getUserServices) return <Dropdown.Item>Loading...</Dropdown.Item>;
                        return getUserServices.map(service => (
                            <Dropdown.Item key={service.id}>
                                {service.name}
                                <Icon
                                    name="edit"
                                    float="right"
                                    onClick={() => {
                                        setService({ id: service.id });
                                        setShowAddServiceModal(true);
                                    }}
                                />
                            </Dropdown.Item>
                        ));
                    }}
                </Query>
                <Dropdown.Divider />
                <Dropdown.Item
                    onClick={() => {
                        setService({});
                        setShowAddServiceModal(true);
                    }}>
                    <Icon name="add" />
                    Add Service
                </Dropdown.Item>
                <Modal closeIcon onClose open={showAddServiceModal}>
                    <Modal.Header>{service.id ? 'Edit Service' : 'Add Service'}</Modal.Header>
                    <ServiceDetails
                        onChange={change => {
                            console.log({ service, change });
                            setService({ ...service, ...change });
                        }}
                        id={service.id}
                        onSaved={() => {
                            setService(null);
                            setShowAddServiceModal(false);
                        }}
                    />
                    <Modal.Actions>
                        <Mutation
                            update={(cache, { data: { saveService } }) => {
                                console.log('updating', { saveService });
                                if (!service.id) {
                                    const { getUserServices } = cache.readQuery({ query: GET_USER_SERVICES });
                                    cache.writeQuery({
                                        query: GET_USER_SERVICES,
                                        data: { getUserServices: getUserServices.concat([saveService]) },
                                    });
                                }
                            }}
                            mutation={SAVE_SERVICE_MUTATION}>
                            {(saveServiceCall, { loading: savingService, data, error }) => {
                                return (
                                    <Button
                                        loading={savingService}
                                        positive
                                        onClick={() => {
                                            console.log('saveService call', service);
                                            saveServiceCall({ variables: { service } });
                                            setShowAddServiceModal(false);
                                        }}>
                                        Save
                                    </Button>
                                );
                            }}
                        </Mutation>
                        <Button negative onClick={() => setShowAddServiceModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Dropdown.Menu>
        </Dropdown>
    );
};
