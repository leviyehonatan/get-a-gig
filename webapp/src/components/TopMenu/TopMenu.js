import React from 'react';
import { Container, Image, Menu, Visibility } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { client } from '../../services/apollo';
import { isAuthenticated, removeToken } from '../../helpers';
import ServicesDropDown from './ServicesDropDown';

export default withRouter(props => (
    <Menu inverted>
        <Query
            query={gql`
                query {
                    profile {
                        picture
                        displayName
                    }
                }
            `}>
            {({ loading, error, data }) => {
                const { profile } = data || {};
                const { displayName, picture } = profile || {};
                return (
                    <Container>
                        <Menu.Item as="a" header>
                            <Image size="mini" src={picture} circular style={{ marginRight: '1.5em' }} />
                            GetAgig
                        </Menu.Item>
                        <Menu.Item as="a" onClick={() => props.history.push('/')}>
                            Home
                        </Menu.Item>
                        {isAuthenticated() && <ServicesDropDown />}
                        <Menu.Item
                            float="right"
                            onClick={() => {
                                console.log('hi');
                                if (isAuthenticated()) {
                                    removeToken();
                                    props.history.push('/');
                                    client.resetStore();
                                } else {
                                    props.history.push('/login');
                                }
                            }}>
                            {isAuthenticated() ? 'Logout' : 'Login'}
                        </Menu.Item>
                        {/* <Dropdown item simple text="Dropdown">
                <Dropdown.Menu>
                    <Dropdown.Divider />
                    <Dropdown.Header>Header Item</Dropdown.Header>
                    <Dropdown.Item>
                        <i className="dropdown icon" />
                        <span className="text">Submenu</span>
                        <Dropdown.Menu>
                            <Dropdown.Item>List Item</Dropdown.Item>
                            <Dropdown.Item>List Item</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}
                    </Container>
                );
            }}
        </Query>
    </Menu>
));
