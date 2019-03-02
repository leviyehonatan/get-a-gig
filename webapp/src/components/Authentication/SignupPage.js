import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { findResponseError, parseResponseErrorsToStringArray, parseGraphQlError } from '../../helpers';

class SignupPage extends Component {
    state = {};

    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    render() {
        return (
            <Mutation mutation={signupMutation}>
                {(signupCall, { loading, error, data }) => {
                    const { signup } = data || {};
                    const { errors } = signup || {};
                    let emailError,
                        signupErrors,
                        passwordError = null;
                    if (errors) {
                        emailError = findResponseError(errors, 'loginInformation.email');
                        passwordError = findResponseError(errors, 'loginInformation.password');
                    }
                    if (errors) {
                        signupErrors = parseResponseErrorsToStringArray(errors);
                        console.log('signupErrors', signupErrors);
                    }
                    if (error) {
                        let graphQLErrors = parseGraphQlError(error);
                        if (graphQLErrors) {
                            signupErrors = signupErrors ? signupErrors.concat(graphQLErrors) : graphQLErrors;
                        }
                    }

                    return (
                        <div className="signup-form">
                            <style>{`
                                body > div,
                                body > div > div,
                                body > div > div > div.signup-form {
                                    height: 100%;
                                }
                            `}</style>
                            <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
                                <Grid.Column style={{ maxWidth: 450 }}>
                                    <Header as="h2" color="teal" textAlign="center">
                                        <Image src="/logo.png" /> Signup for an Account!
                                    </Header>
                                    <Form size="large">
                                        <Segment stacked>
                                            <Form.Input
                                                name="email"
                                                onChange={this.handleInputChange}
                                                error={!!emailError}
                                                fluid
                                                icon="envelope"
                                                iconPosition="left"
                                                placeholder="E-mail address"
                                            />
                                            <Form.Input
                                                name="password"
                                                onChange={this.handleInputChange}
                                                error={!!passwordError}
                                                fluid
                                                icon="lock"
                                                iconPosition="left"
                                                placeholder="Password"
                                                type="password"
                                            />

                                            <Button
                                                loading={loading}
                                                onClick={() => {
                                                    const { email, password } = this.state;
                                                    signupCall({
                                                        variables: {
                                                            email,
                                                            password,
                                                        },
                                                    });
                                                }}
                                                color="teal"
                                                fluid
                                                size="large">
                                                Signup
                                            </Button>
                                        </Segment>
                                    </Form>
                                    {signupErrors && (
                                        <Message error header="there were some errors" list={signupErrors} />
                                    )}
                                    <Message>
                                        Already Signed Up? <a href="/login">Login</a>
                                    </Message>

                                    {}
                                </Grid.Column>
                            </Grid>
                        </div>
                    );
                }}
            </Mutation>
        );
    }
}

const signupMutation = gql`
    mutation($email: String!, $password: String!) {
        signup(loginInformation: { email: $email, password: $password }) {
            token
            errors {
                path
                message
            }
        }
    }
`;

export default SignupPage;
