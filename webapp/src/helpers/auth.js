import config from '../config';

const token_name = config.token_name;

export function isAuthenticated() {
    return getToken() !== null;
}

export function getToken() {
    return localStorage.getItem(token_name);
}

export function setToken(token) {
    localStorage.setItem(token_name, token);
}

export function removeToken() {
    localStorage.removeItem(token_name);
}
