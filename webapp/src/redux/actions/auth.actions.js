import { authConstants } from '../constants';
import { authService } from '../../services';
import { history } from '../../helpers';

export const authActions = {
    signup,
    login,
    logout,
}

function signup(signupForm) {
    return dispatch => {
        dispatch(request());
        authService.signup(signupForm)
            .then(responseWithToken => {
                dispatch(success());
                handleResponseWithToken(responseWithToken);
            })
            .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: authConstants.SIGNUP_REQUEST }; }
    function success() { return { type: authConstants.SIGNUP_SUCCESS }}
    function failure(error) { return { type: authConstants.SIGNUP_FAILURE, payload: error }}
}

function login(loginForm) {
    return dispatch => {
        dispatch(request());
        authService.login(loginForm)
            .then(responseWithToken => {
                dispatch(success());
                handleResponseWithToken(responseWithToken);
            })
            .catch(error => dispatch(failure(error)));
    }
    function request() { return { type: authConstants.LOGIN_REQUEST }; }
    function success() { return { type: authConstants.LOGIN_SUCCESS }}
    function failure(error) { return { type: authConstants.LOGIN_FAILURE, payload: error }}
}

function logout() {
    return dispatch => {
        dispatch({ type: authConstants.LOGOUT });
        localStorage.removeItem('token');
    }
}

function handleResponseWithToken(responseWithToken) {
    localStorage.setItem('token', JSON.stringify(responseWithToken.token));
    history.push('/');
}



