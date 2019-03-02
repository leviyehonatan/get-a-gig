import { authConstants } from '../constants';
import { isAuthenticated } from '../../helpers';

const initialState = { 
    isAuthenticated: isAuthenticated() 
};

export default function (state = initialState, action) {
    switch (action.type) {
        case authConstants.SIGNUP_REQUEST:
            return {
                ...state,
                signingUp: true,
                signupError: null,
            };
        case authConstants.SIGNUP_SUCCESS:
            return {
                isAuthenticated: true,
            }
        case authConstants.SIGNUP_FAILURE:
            return { 
                ...state,
                signingUp: null,
                signupError: action.payload,
            }
        case authConstants.LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
            }
        case authConstants.LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
            };
        case authConstants.LOGIN_FAILURE:
            return {
                ...state,
                loggingIn: null,
                loginError: action.payload,
            }
        case authConstants.LOGOUT: 
            return {};
        default:
            return state;
    }
}
