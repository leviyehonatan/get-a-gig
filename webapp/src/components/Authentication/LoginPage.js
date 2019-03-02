import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FacebookLogin from 'react-facebook-login';
import config from '../../config';
import { setToken, removeToken } from '../../helpers';
import { client } from '../../services/apollo';

class LoginPage extends Component {
    state = {};

    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    componentDidMount() {
        removeToken();
        client.cache.reset();
    }

    render() {
        return (
            <div>
                <Mutation mutation={loginMutation}>
                    {(loginCall, { loading, error, data }) => {
                        const { login } = data || {};
                        const { token, errors } = login || {};
                        if (token) {
                            setToken(token);
                            console.log('reset store');
                            client.resetStore();
                            return <Redirect to="/" />;
                        }
                        let emailError,
                            loginErrors,
                            passwordError = null;
                        if (errors) {
                            loginErrors = loginErrors || [];
                            errors.forEach(validationError => {
                                switch (validationError.path) {
                                    case 'loginInformation.email':
                                        emailError = validationError.message;
                                        loginErrors.push(emailError);
                                        break;
                                    case 'loginInformation.password':
                                        passwordError = validationError.message;
                                        loginErrors.push(passwordError);
                                        break;
                                    default:
                                }
                            });
                        }
                        if (error) {
                            loginErrors = loginErrors || [];
                            loginErrors.push(error);
                        }
                        return (
                            <div className="login-form">
                                <style>{`
                                body > div,
                                body > div > div,
                                body > div > div > div.login-form {
                                    height: 100%;
                                }
                            `}</style>
                                <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
                                    <Grid.Column style={{ maxWidth: 450 }}>
                                        <Header as="h2" color="teal" textAlign="center">
                                            <Image src="/logo.png" /> Log-in to your account
                                        </Header>
                                        <Form size="large">
                                            <Segment stacked>
                                                <Mutation mutation={facebookLoginMutation}>
                                                    {(facebookLoginCall, { loading, error, data, called }) => {
                                                        console.log('facebook mutation data', data);
                                                        const { facebookLogin } = data || {};
                                                        const { errors, token } = facebookLogin || {};
                                                        if (token) {
                                                            setToken(token);
                                                            console.log('reset store');
                                                            client.resetStore();
                                                            return <Redirect to="/" />;
                                                        }
                                                        return (
                                                            <div>
                                                                <FacebookLogin
                                                                    buttonStyle={{
                                                                        width: '100%',
                                                                        marginBottom: '.5em',
                                                                    }}
                                                                    appId={config.facebook.appId}
                                                                    icon="fa-facebook"
                                                                    size="small"
                                                                    //fields="name,email,picture"
                                                                    fields="name,first_name,last_name,email,id,picture"
                                                                    callback={response => {
                                                                        const { accessToken: facebookToken } = response;
                                                                        facebookLoginCall({
                                                                            variables: { facebookToken },
                                                                        });
                                                                    }}
                                                                />
                                                                {loading && <Loader />}
                                                                {errors && (
                                                                    <Message
                                                                        list={errors.map(
                                                                            responseError => responseError.message
                                                                        )}
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                </Mutation>
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
                                                        loginCall({
                                                            variables: {
                                                                email,
                                                                password,
                                                            },
                                                        });
                                                    }}
                                                    color="teal"
                                                    fluid
                                                    size="large">
                                                    Login
                                                </Button>
                                            </Segment>
                                        </Form>
                                        {loginErrors && (
                                            <Message error header="there were some errors" list={loginErrors} />
                                        )}
                                        <Message>
                                            Still not signed up? <a href="/signup">signup</a>
                                        </Message>

                                        {}
                                    </Grid.Column>
                                </Grid>
                            </div>
                        );
                    }}
                </Mutation>
            </div>
        );
    }
}

const facebookLoginMutation = gql`
    mutation($facebookToken: String!) {
        facebookLogin(facebookToken: $facebookToken) {
            token
            errors {
                path
                message
            }
        }
    }
`;

const loginMutation = gql`
    mutation($email: String!, $password: String!) {
        login(loginInformation: { email: $email, password: $password }) {
            token
            errors {
                path
                message
            }
        }
    }
`;

export default LoginPage;
