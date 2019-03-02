import React from 'react';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
// import './App.css';
import LoginPage from './Authentication/LoginPage';
import SignupPage from './Authentication/SignupPage';
import Home from './Home';
import { removeToken } from '../helpers';
import TopMenu from './TopMenu/TopMenu';
import { Container } from 'semantic-ui-react';

export default () => (
    <Router>
        <div>
            <TopMenu />
            <Container>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/signup" component={SignupPage} />
                        <Route
                            path="/logout"
                            render={props => {
                                removeToken();
                                return <Redirect to="/login" />;
                            }}
                        />
                    </Switch>
                </div>
            </Container>
        </div>
    </Router>
);
